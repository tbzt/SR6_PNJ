var render = {
  templates: null,

  mook: function ($target, data, options) {
    if (options === undefined) {
      options = {};
    }

    options = $.extend({}, {
      mode: 'display'
    }, options);

    switch (options.mode) {
      default:
      case 'display': // Default view, includes icons to convert to action and edit modes
        this.mook_for_display($target, data, options);
        break;
      case 'action': // This is similar to display but includes buttons to roll most skills and initiative
        this.mook_for_action($target, data, options);
        break;
      case 'edit': // Lots of dropdowns and widgets to change the NPC
        this.mook_for_edit($target, data, options);
        break;
      case 'print': // Strictly for printing to PDF or other non-interactive modes
        this.mook_for_print($target, data, options);
        break;
    }
  },

  mook_for_print: function ($target, data, options) {
    // TODO for now, just use the existing one
    this.mook_for_display($target, data, options);
  },

  mook_for_edit: function ($target, data, options) {
    var i, $mook = render.get_template('render__edit_npc');

    options = $.extend({}, {
      view_after_save: 'action'
    }, options);

    var original_data = $.extend({}, data);

    $target.empty().append($mook);

    // Add buttons to enter other modes
    $mook.find('button').button();

    $mook.find('.controls button.revert').click(function () {
      switch (options.view_after_save) {
        case 'action':
          render.mook_for_action($target, original_data, options);
          break;

        case 'display':
          render.mook_for_display($target, original_data, options);
          break;

        default:
          console.log('ERROR: mook_for_edit() revert with unknown mode', options.view_after_save);
      }
    });

    var save_mook = function () {
      var changes_made = false;

      // Name
      if (data.name !== $mook.find('#name').val().trim()) {
        data.name = $mook.find('#name').val().trim();
        changes_made = true;
      }

      // Notes
      if (data.notes !== $mook.find('#npc_notes').val().trim()) {
        data.notes = $mook.find('#npc_notes').val().trim();
        changes_made = true;
      }

      // Gender
      if (data.gender !== $mook.find('select[name="gender"]').val().trim()) {
        data.gender = $mook.find('select[name="gender"]').val().trim();
        changes_made = true;
      }

      // Race
      if (data.race !== $mook.find('select[name="race"]').val().trim()) {
        data.race = $mook.find('select[name="race"]').val().trim();
        changes_made = true;
      }

      // If not a Troll, make sure they don't have Dermal Deposits
      if (data.race !== 'Troll') {
        data.augmentations = data.augmentations.filter(function (aug) {
          return aug.name !== 'Dépôts dermiques';
        });
      }
      else {
        // If this troll doesn't have skin augmentations, make sure they have standard Troll hide
        var has_troll_skin = data.augmentations.find(function (aug) {
          return aug.name === 'Dépôts dermiques';
        });

        if (!has_troll_skin) {
          data.augmentations.push({ name: 'Dépôts dermiques' });
        }
      }

      // Attributes
      var attributes = ['body', 'agility', 'reaction', 'strength', 'will', 'logic', 'intuition', 'charisma'];

      attributes.forEach(function (attribute) {
        if (data.attributes[attribute] !== $mook.find('.attribute_values select[name="attribute_' + attribute + '"]').val()) {
          data.attributes[attribute] = parseInt($mook.find('.attribute_values select[name="attribute_' + attribute + '"]').val());
          changes_made = true;
        }
      });

      // Condition Monitor
      if (data.condition_monitor !== $mook.find('.condition_monitor input[name="condition_monitor"]:checked').attr('id')) {
        data.condition_monitor = $mook.find('.condition_monitor input[name="condition_monitor"]:checked').attr('id');
        changes_made = true;
      }

      // Wound Penalties
      if (data.wound_penalty !== $mook.find('.wound_penalty input[name="wound_penalty"]:checked').attr('id')) {
        data.wound_penalty = $mook.find('.wound_penalty input[name="wound_penalty"]:checked').attr('id');
        changes_made = true;
      }

      // Armor
      data.armor = $mook.find('.other_information .armor .value select').val();

      // Commlink
      data.commlink = parseInt($mook.find('.other_information .commlink .value select').val());

      // Last edited
      if (changes_made)
        data.edited = new Date().toJSON();

      if (data.hasOwnProperty('character_id') && changes_made) {
        storage.set_character(data);
      }

      switch (options.view_after_save) {
        case 'action':
          render.mook_for_action($target, data, options);
          break;

        case 'display':
          render.mook_for_display($target, data, options);
          break;

        case 'edit':
          render.mook_for_edit($target, data, options);
          break;
      }
    };

    $mook.find('.controls button.save').click(save_mook);

    // Mook name
    $mook.find('#name').val(data.name);

    // Gender
    $mook.find('select[name="gender"] option[value="' + data.gender + '"]').prop('selected', true);

    // Race
    $mook.find('select[name="race"] option[value="' + data.race + '"]').prop('selected', true);

    var attributes = ['body', 'agility', 'reaction', 'strength', 'will', 'logic', 'intuition', 'charisma'];
    var metatype_attributes = db.get_metatype_adjustment(data.race);

    attributes.forEach(function (attribute) {
      var $select = $('<select name="attribute_' + attribute + '"/>').appendTo($mook.find('.attribute_values .attribute_value.' + attribute));

      for (var i = metatype_attributes.min_attributes[attribute]; i <= metatype_attributes.max_attributes[attribute]; i++) {
        $select.append($('<option/>').html(i).attr('value', i))
      }

      if (data.attributes[attribute] < metatype_attributes.min_attributes[attribute])
        data.attributes[attribute] = metatype_attributes.min_attributes[attribute];

      if (data.attributes[attribute] > metatype_attributes.max_attributes[attribute])
        data.attributes[attribute] = metatype_attributes.max_attributes[attribute];

      $mook.find('.attribute_values select[name="attribute_' + attribute + '"] option[value="' + data.attributes[attribute] + '"]').prop('selected', true);
    });

    var metatype_changed = function () {
      var differences = {
        body: 0,
        agility: 0,
        reaction: 0,
        strength: 0,
        will: 0,
        logic: 0,
        intuition: 0,
        charisma: 0
      };
      var attributes = Object.keys(differences);
      var original_attributes = db.get_metatype_adjustment(data.race);
      var updated_attributes = db.get_metatype_adjustment($mook.find('select[name="race"]').val());

      attributes.forEach(function (attr) {
        differences[attr] = parseInt($mook.find('select[name="attribute_' + attr + '"]').val()) - original_attributes.min_attributes[attr];

        var cap = updated_attributes.max_attributes[attr] - updated_attributes.min_attributes[attr];
        if (differences[attr] > cap)
          differences[attr] = cap;

        $mook.find('.attribute_values .attribute_value.' + attr).empty();

        var $select = $('<select name="attribute_' + attr + '"/>').appendTo($mook.find('.attribute_values .attribute_value.' + attr));

        for (var i = updated_attributes.min_attributes[attr]; i <= updated_attributes.max_attributes[attr]; i++) {
          $select.append($('<option/>').html(i).attr('value', i))
        }

        $mook.find('.attribute_values select[name="attribute_' + attr + '"] option[value="' + (updated_attributes.min_attributes[attr] + differences[attr]) + '"]').prop('selected', true);
      });
    };

    $mook.find('select[name="race"]').on('change', metatype_changed).change();

    // Remove the Magic score, even if they have one
    $mook.find('.attribute_names .magic, .attribute_names .initiate').hide();
    $mook.find('.attribute_values .magic, .attribute_values .initiate').hide();

    // Condition Monitor
    $mook.find('.other_information .condition_monitor > div').buttonset();
    $mook.find('.other_information .condition_monitor input#' + data.condition_monitor).click();

    // Wound Penalties
    $mook.find('.other_information .wound_penalty > div').buttonset();
    $mook.find('.other_information .wound_penalty input#' + data.wound_penalty).click();

    // Qualities
    var redraw_qualities = function () {
      var all_qualities = db.get_quality_list(), $new_quality, $select;
      var $positive_qualities = $mook.find('.other_information .qualities > div.positive');
      var $negative_qualities = $mook.find('.other_information .qualities > div.negative');

      $positive_qualities.empty();
      data.qualities.positive.forEach(function (quality) {
        var $quality = render.get_template('edit_quality').appendTo($positive_qualities);
        $quality.find('.quality').html(quality);
        $quality.find('button').prop('quality_name', quality).prop('quality', 'positive');
        $quality.find('button').button();

        // Need to skip some special qualities: 'Adept' and 'Magician (Hermetic)'
        // If either one is present, they can't be edited or deleted
        var skip_qualities = ['Adepte', 'Mage'];
        if (skip_qualities.includes(quality))
          $quality.find('button').detach();
      });

      $new_quality = $('<div/>').appendTo($positive_qualities);
      $select = $('<select name="quality_name"/>').prop('quality', 'positive').appendTo($new_quality);
      $select.append($('<option/>'));

      all_qualities.positive.forEach(function (quality) {
        if (!data.qualities.positive.includes(quality)) {
          $select.append($('<option value="' + quality + '"/>').html(quality));
        }
      });

      $negative_qualities.empty();
      data.qualities.negative.forEach(function (quality) {
        var $quality = render.get_template('edit_quality').appendTo($negative_qualities);
        $quality.find('.quality').html(quality);
        $quality.find('button').prop('quality_name', quality).prop('quality', 'negative');
        $quality.find('button').button();
      });

      $new_quality = $('<div/>').appendTo($negative_qualities);
      $select = $('<select name="quality_name"/>').prop('quality', 'negative').appendTo($new_quality);
      $select.append($('<option/>'));

      all_qualities.negative.forEach(function (quality) {
        if (!data.qualities.negative.includes(quality)) {
          $select.append($('<option value="' + quality + '"/>').html(quality));
        }
      });
    };

    $mook.find('.other_information .qualities > div.quality').on('change', 'select[name="quality_name"]', function () {
      var quality = $(this).prop('quality');
      if ($(this).val().length !== 0)
        data.qualities[quality].push($(this).val());

      redraw_qualities();
    });

    $mook.find('.other_information .qualities > div.quality').on('click', 'button.remove_quality', function () {
      var quality = $(this).prop('quality'), remove = $(this).prop('quality_name'), i = data.qualities[quality].indexOf(remove);
      data.qualities[quality].splice(i, 1);

      redraw_qualities();
    });

    redraw_qualities();

    // Skills
    var redraw_skills = function () {
      var $skill_div = $mook.find('.other_information .skills > div.value'), current_skills, all_skills;

      $skill_div.empty();

      current_skills = Object.keys(data.skills);

      current_skills.forEach(function (skill) {
        var $skill = render.get_template('edit_skill').appendTo($skill_div);

        $skill.find('.skill').html(skill);
        $skill.find('select[name="skill_rating"]').prop('skill_name', skill);
        $skill.find('button').prop('skill_name', skill);
        $skill.find('button').button();

        for (var i = 1; i <= 12; i++) {
          var $option = $('<option value="' + i + '"/>').html(i).appendTo($skill.find('select[name="skill_rating"]'));

          if (data.skills[skill] === i)
            $option.prop('selected', true);
        }
      });

      var $skill = $('<div/>').appendTo($skill_div);
      var $select = $('<select name="skill_name"/>').appendTo($skill);
      $select.append($('<option/>'));

      all_skills = db.get_skill_list();

      all_skills.forEach(function (skill) {
        if (!current_skills.includes(skill)) {
          $select.append($('<option value="' + skill + '"/>').html(skill));
        }
      });
    };

    $mook.find('.other_information .skills > div.value').on('change', 'select[name="skill_name"]', function (e) {
      if ($(this).val().length !== 0)
        data.skills[$(this).val()] = 1;

      redraw_skills();
    });

    $mook.find('.other_information .skills > div.value').on('change', 'select[name="skill_rating"]', function (e) {
      data.skills[$(this).prop('skill_name')] = parseInt($(this).val());

      redraw_skills();
    });

    $mook.find('.other_information .skills > div.value').on('click', 'button.remove_skill', function (e) {
      var remaining_skills = {}, current_skills = Object.keys(data.skills), remove_skill = $(this).prop('skill_name');

      current_skills.forEach(function (skill) {
        if (remove_skill !== skill)
          remaining_skills[skill] = data.skills[skill];
      });

      data.skills = remaining_skills;

      redraw_skills();
    });

    redraw_skills();

    // Augmentations
    var all_augments = db.get_augmentation_list();

    var redraw_augmentations = function () {
      var $augmentation_div = $mook.find('.other_information .augments > div.value'), current_augments = [], stock_augment;

      $augmentation_div.empty();

      data.augmentations.forEach(function (augmentation) {
        var i, name, rating = null, max_rating = null, $augmentation = render.get_template('edit_augmentation').appendTo($augmentation_div);

        if (typeof augmentation === 'string') {
          name = augmentation;
        }
        else {
          name = augmentation.name;

          if (augmentation.hasOwnProperty('rating')) {
            rating = augmentation.rating;
            stock_augment = db.get_augmentation(name);
            max_rating = stock_augment.max_rating;
          }
        }

        current_augments.push(name);

        $augmentation.find('span.augmentation').html(name);

        if (rating === null) {
          $augmentation.find('select[name="augmentation_rating"]').remove();
        }
        else {
          $augmentation.find('select[name="augmentation_rating"]').prop('augmentation_name', name);

          for (i = 1; i <= max_rating; i++) {
            var $option = $('<option value="' + i + '"/>').html(i).appendTo($augmentation.find('select[name="augmentation_rating"]'));

            if (rating === i)
              $option.prop('selected', true);
          }
        }

        $augmentation.find('button').prop('augmentation_name', name);
        $augmentation.find('button').button();
      });

      var $select = $('<select name="augmentation_name"/>').appendTo($augmentation_div);
      $select.append($('<option/>'));

      all_augments.forEach(function (aug) {
        if (!current_augments.includes(aug.name)) {
          if (aug.selectable !== false)
            $select.append($('<option value="' + aug.name + '"/>').html(aug.name));
        }
      });
    };

    $mook.find('.other_information .augments > div.value').on('change', 'select[name="augmentation_name"]', function (e) {
      if ($(this).val().length !== 0) {
        var augment_name = $(this).val(), stock_augment = db.get_augmentation(augment_name);

        if (stock_augment.hasOwnProperty('max_rating')) {
          stock_augment.rating = 1;
        }

        data.augmentations.push(stock_augment);
      }

      redraw_augmentations();
    });

    $mook.find('.other_information .augments > div.value').on('change', 'select[name="augmentation_rating"]', function (e) {
      var rating = parseInt($(this).val());
      var name = $(this).prop('augmentation_name');

      data.augmentations.forEach(function (aug) {
        if (aug.name === name)
          aug.rating = rating;
      });

      redraw_augmentations();
    });

    $mook.find('.other_information .augments > div.value').on('click', 'button.remove_augmentation', function (e) {
      var remaining = [], remove = $(this).prop('augmentation_name');

      data.augmentations.forEach(function (aug) {
        if (aug.name !== remove)
          remaining.push(aug);
      });

      data.augmentations = remaining;

      redraw_augmentations();
    });

    // Don't let Mages or Adepts have augmentations
    if (data.special.is_adept === true || data.special.is_mage === true || data.special.is_shaman === true)
      $mook.find('.other_information .augments').hide();
    else
      redraw_augmentations();

    // Armor
    $('<option value=""/>').appendTo($mook.find('.other_information .armor select[name="armor"]'));

    Object.keys(db.get_armor_list()).forEach(function (armor) {
      $('<option value="' + armor + '"/>').html(armor).appendTo($mook.find('.other_information .armor select[name="armor"]'));
    });

    if (data.armor)
      $mook.find('.other_information .armor select[name="armor"] option[value="' + data.armor + '"]').prop('selected', true);

    // Weapons
    var redraw_weapons = function () {
      var all_weapons = db.get_weapon_list(), $new_weapon, $select;
      var $weapons = $mook.find('.other_information .weapons .value');

      $weapons.empty();
      data.weapons.forEach(function (weapon) {
        var $weapon = render.get_template('edit_weapon').appendTo($weapons);
        $weapon.find('button').button();

        if (typeof weapon === 'string') {
          $weapon.find('.weapon').html(weapon);
          $weapon.find('button').prop('weapon_name', weapon);
        }
        else if (weapon.weapon_focus === true) {
          $weapon.find('.weapon').html(weapon.name + ' (Arme Focus)');
          $weapon.find('button').prop('weapon_name', weapon.name);
        }
        else if (weapon.magic_focus === true) {
          $weapon.find('.weapon').html(weapon.base_name + ' ' + weapon.name);
          $weapon.find('button').prop('weapon_name', weapon.name);
        }
        else {
          $weapon.find('.weapon').html(weapon.name);
          $weapon.find('button').prop('weapon_name', weapon.name);
        }
      });

      $new_weapon = $('<div/>').appendTo($weapons);
      $select = $('<select name="weapon_name"/>').appendTo($new_weapon);
      $select.append($('<option/>'));

      all_weapons.forEach(function (weapon) {
        $select.append($('<option value="' + weapon + '"/>').html(weapon));
      });
    };

    $mook.find('.other_information .weapons > .value').on('change', 'select[name="weapon_name"]', function () {
      if ($(this).val().length !== 0) {
        var weapon = db.get_weapon($(this).val());

        if (weapon.name)
          data.weapons.push(weapon.name);
      }

      redraw_weapons();
    });

    $mook.find('.other_information .weapons > .value').on('click', 'button.remove_weapon', function () {
      var remaining = [], remove = $(this).prop('weapon_name'), removed = false;

      data.weapons.forEach(function (weapon) {
        if (removed) {
          remaining.push(weapon);
        }
        else if (typeof weapon === 'string') {
          if (weapon !== remove)
            remaining.push(weapon);
          else
            removed = true;
        }
        else {
          if (weapon.name !== remove)
            remaining.push(weapon);
          else
            removed = true;
        }
      });

      data.weapons = remaining;

      redraw_weapons();
    });

    redraw_weapons();

    // Gear
    var redraw_gear = function () {
      var all_gear = db.get_gear_list(), $new_gear, $select;
      var $all_gear = $mook.find('.other_information .gear .value');

      $all_gear.empty();
      data.gear.forEach(function (gear) {
        var $gear = render.get_template('edit_gear').appendTo($all_gear);
        $gear.find('button').button();

        if (typeof gear === 'string') {
          $gear.find('.gear').html(gear);
          $gear.find('button').prop('gear_name', gear);
        }
        else if (gear.magic_focus === true) {
          $gear.find('.gear').html(gear.name + ' (' + gear.power + ')');
          $gear.find('button').prop('gear_name', gear.name);
        }
        else {
          var gear_display = gear.name;

          if (gear.hasOwnProperty('rating')) {
            gear_display += ' indice ' + gear.rating + '';
          }

          if (gear.hasOwnProperty('quantity')) {
            gear_display += ' (' + gear.quantity + ')';
          }

           if (gear.hasOwnProperty('description')) {
            gear_display += ' : ' + gear.description;
          }

          $gear.find('.gear').html(gear_display);
          $gear.find('button').prop('gear_name', gear.name);
        }
      });

      $new_gear = $('<div/>').appendTo($all_gear);
      $select = $('<select name="gear_name"/>').appendTo($new_gear);
      $select.append($('<option/>'));

      all_gear.forEach(function (gear) {
        $select.append($('<option value="' + gear.name + '"/>').html(gear.name));
      });
    };

    $mook.find('.other_information .gear > .value').on('change', 'select[name="gear_name"]', function () {
      if ($(this).val().length !== 0) {
        var name = $(this).val(), all_gear = db.get_gear_list();

        all_gear.forEach(function (gear) {
          if (gear.name === name)
            data.gear.push(gear);
        });
      }

      redraw_gear();
    });

    $mook.find('.other_information .gear > .value').on('click', 'button.remove_gear', function () {
      var remaining = [], remove = $(this).prop('gear_name'), removed = false;

      data.gear.forEach(function (gear) {
        if (removed) {
          remaining.push(gear);
        }
        else if (typeof gear === 'string') {
          if (gear !== remove)
            remaining.push(gear);
          else
            removed = true;
        }
        else {
          if (gear.name !== remove)
            remaining.push(gear);
          else
            removed = true;
        }
      });

      data.gear = remaining;

      redraw_gear();
    });

    redraw_gear();

    // Commlink
    $mook.find('.other_information .commlink .value option[value="' + data.commlink + '"]').prop('selected', true);
  },

  mook_for_action: function ($target, data, options) {
    var i, $mook = render.get_template('render__action_npc'), wp = { penalty: 0 };

    options = $.extend({}, options);

    $target.empty().append($mook);

    // Add buttons to enter other modes
    $mook.find('button').button();

    $mook.find('.controls button.display').click(function () {
      render.mook_for_display($target, data, options);
    });

    $mook.find('.controls button.edit').click(function () {
      options.view_after_save = 'action';
      render.mook_for_edit($target, data, options);
    });

    // Fill in the name and description
    if (data.edited) {
      $mook.find('.npc_name').html(data.name + ' -- ' + data.race + ' ' + data.gender + ',  ' + data.professional_description + ' - Professionalisme ' + data.professional_rating);

      $mook.find('.npc_description').hide();
    }
    else {
      $mook.find('.npc_name').html(data.name);

      var description = data.name + ' -- ' + data.race + ' ' + data.gender + ',  ' + data.professional_description + ' - Professionalisme ' + data.professional_rating;

      if (data.special.is_lt)
        description += ', Lieutenant';
      if (data.special.is_decker)
        description += ', Decker';
      if (data.special.is_adept)
        description += ', Adepte';
      if (data.special.is_mage)
        description += ', Magicien';
      if (data.special.is_shaman)
        description += ', Chaman';

      $mook.find('.npc_description').html(description);
    }

    // Fill in notes if there are any
    if (data.notes) {
      $mook.find('.npc_notes').html(data.notes);
    }
    else {
      $mook.find('.npc_notes').hide();
    }

    // Base Attributes
    var augmented_attributes = this.calc_augmented_attributes(data);
    var base_attributes = ['body', 'agility', 'reaction', 'strength', 'will', 'logic', 'intuition', 'charisma'];

    base_attributes.forEach(function (i) {
      var a = data.attributes[i];
      if (augmented_attributes[i] !== data.attributes[i]) {
        a += ' (' + augmented_attributes[i] + ')';
      }
      $mook.find('.attribute_values .attribute_value.' + i).html(a);
    });

    // Essence
    // Working around display issues of whole numbers vs repeating numbers
    if (augmented_attributes.essence % 1 === 0) {
      $mook.find('.attribute_values .attribute_value.essence').html(augmented_attributes.essence);
    }
    else if ((augmented_attributes.essence * 10) % 1 === 0) {
      $mook.find('.attribute_values .attribute_value.essence').html(augmented_attributes.essence.toFixed(1));
    }
    else {
      $mook.find('.attribute_values .attribute_value.essence').html(augmented_attributes.essence.toFixed(2));
    }

    // Set/Hide Magic
    if (data.special.hasOwnProperty('Magic')) {
      $mook.find('.attribute_values .attribute_value.magic').html(data.special.Magic);
    }
    else {
      $mook.find('.attribute_name.magic, .attribute_value.magic').hide();
    }

    // Initiative
    var initiative = this.calc_initiative(data, augmented_attributes);

    var init_display = initiative.base + ' ';

    if (initiative.base !== initiative.base_augmented) {
      init_display += '(' + initiative.base_augmented + ') ';
    }

    init_display += '+ ' + initiative.dice + 'D6';

    if (initiative.base !== initiative.base_augmented) {
      init_display += ' (' + initiative.dice_augmented + 'D6)';
    }

    // Major and Minor actions
    var major = 1, minor = initiative.dice_augmented;

    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Réflexes câblés' || aug.name === 'Amplificateur synaptique') {
        minor += aug.rating;
      }
    });

    init_display += ' [Majeure ' + major + '/mineure ' + minor + ']';

    $mook.find('.information .initiative .value').html(init_display);

    $mook.find('.information .initiative button').button().click(function () {
      var i, total = initiative.base_augmented;

      for (i = initiative.dice_augmented; i > 0; i--) {
        total += roll.dval(6);
      }

      $mook.find('.information .initiative .result').html(total + wp.penalty);
    });

    if (data.special.is_decker === true) {
      var matrix_initiative = this.calc_initiative(data, augmented_attributes, 'matricielle');
      $mook.find('.information .matrix_initiative .value').html('Traitement de données + ' + matrix_initiative.base + ' + ' + matrix_initiative.dice + 'D6');

      $mook.find('.information .matrix_initiative button').button().click(function () {
        var i, total = matrix_initiative.base;

        for (i = matrix_initiative.dice; i > 0; i--) {
          total += roll.dval(6);
        }

        total += wp.penalty;

        $mook.find('.information .matrix_initiative .result').html(total + " + Traitement de données");
      });
    }
    else {
      $mook.find('.information .matrix_initiative').hide();
    }

    if (data.special.is_mage === true || data.special.is_shaman === true) {
      var astral_initiative = this.calc_initiative(data, augmented_attributes, 'astrale');
      $mook.find('.information .astral_initiative .value').html(astral_initiative.base + ' + ' + astral_initiative.dice + 'D6');

      $mook.find('.information .astral_initiative button').button().click(function () {
        var i, total = astral_initiative.base;

        for (i = astral_initiative.dice; i > 0; i--) {
          total += roll.dval(6);
        }

        $mook.find('.information .astral_initiative .result').html(total + wp.penalty);
      });
    }
    else {
      $mook.find('.information .astral_initiative').hide();
    }

    // Drain resistance
    if (data.special.is_mage === true || data.special.is_shaman === true) {

    // Drain resistance for shaman
    if (data.special.is_shaman === true) {    
    var drain_resistance = data.attributes.charisma + data.attributes.will;
    $mook.find('.information .drain_resistance .value').html(drain_resistance);
    $mook.find('.information .drain_resistance button').button().click(function () {
    var d = drain_resistance;
    if (wp.penalty !== 0)
        d += wp.penalty;
        var i = roll.d(d), total = i.hits;
    $mook.find('.information .drain_resistance .result').html(total + wp.penalty);
      });
    }

    // Drain resistance for mage
    if (data.special.is_mage === true) {     
    var drain_resistance = data.attributes.logic + data.attributes.will;

    $mook.find('.information .drain_resistance .value').html(drain_resistance);
    $mook.find('.information .drain_resistance button').button().click(function () {
      var d = drain_resistance;

      if (wp.penalty !== 0)
        d += wp.penalty;

      var i = roll.d(d), total = i.hits;

        $mook.find('.information .drain_resistance .result').html(total + wp.penalty);
      });
    }
  }
    else {
      $mook.find('.information .drain_resistance').hide();
    }


    // Condition Monitor
    $mook.find('.information .condition_monitor').append(render.get_condition_monitor(wp, data));

    // Qualities
    if (data.qualities.positive.length === 0 && data.qualities.negative.length === 0) {
      $mook.find('.information .qualities').hide();
    }
    else {
      $mook.find('.information .qualities .value').html(data.qualities.positive.concat(data.qualities.negative).join(', '));
    }

    // Initiate Grade
    if (data.special.hasOwnProperty('Initiate')) {
      $mook.find('.information .initiate_grade .value').html(data.special.Initiate);
    }
    else {
      $mook.find('.information .initiate_grade').hide();
    }

    // Skills
    var improved_skills = [], improved_rating = 0, $skill, skill, skill_data, power_focus;

    power_focus = data.gear.find(function (gear) {
      return gear.name === 'Focus de pouvoir';
    });

    // TODO This only really accounts for 1 improved ability, but that's all that is generated right now
    if (data.special.is_adept === true) {
      for (i in data.special.powers) {
        var improved_power = data.special.powers[i];

        if (improved_power.name === 'Compétence améliorée') {
          improved_skills.push(improved_power.ability);

          improved_rating = improved_rating < improved_power.rating ? improved_power.rating : improved_rating;
        }
      }
    }

    for (skill in data.skills) {
      if (data.skills[skill] <= 0) {
        continue;
      }

      $skill = render.get_template('action_skill').appendTo($mook.find('.information .skills .skill_list'));

      skill_data = db.get_skill_attributes(skill);

      $skill.prop('pool', (data.skills[skill] + augmented_attributes[skill_data.attribute]));

      // Magic-based skills
      // TODO need a different way to determine the pool for magic skills
      if (skill_data.attribute === 'magic')
        $skill.prop('pool', (data.skills[skill] + data.special.Magic));

      $skill.find('.skill').html(skill + ' ' + data.skills[skill]);
      $skill.prop('skill', skill);

      if (improved_skills.includes(skill)) {
        var improved_skill_rating = data.skills[skill] + improved_rating;
        $skill.prop('pool', data.skills[skill] + augmented_attributes[skill_data.attribute] + improved_rating);
        $skill.find('.skill').html(skill + ' ' + data.skills[skill] + ' (' + improved_skill_rating + ')');
      }

      // TODO need a different way to determine the pool for magic skills
      if ((skill_data.attribute === 'magic') && power_focus !== undefined) {
        $skill.prop('pool', $skill.prop('pool') + power_focus.rating);
      }

      $skill.find('button').button().click(function () {
        var $skill = $(this).parent();
        var d = $skill.prop('pool'), i = roll.d(d), total = i.hits;

        if (wp.penalty !== 0) {
          if ((d + wp.penalty) <= 0) {
            $skill.find('.result').html('No pool w/ wounds');
            return;
          }

          i = roll.d(d + wp.penalty);
          total = i.hits;
        }

        if (i.glitch)
          total += ', complication';
        else if (i.crit_glitch)
          total += ', ECHEC CRITIQUE';

        $skill.find('.result').html(total);
      });
    }

    // Augmentations
    if (data.augmentations.length) {
      var augments = [], augment, aug;

      for (i in data.augmentations) {
        aug = data.augmentations[i];

        if (typeof aug === 'string') {
          debugger; // This shouldn't happen anymore
          augments.push(aug);
          continue;
        }

        augment = aug.name;

        if (aug.name === 'Ossature renforcée') {
          if (aug.rating === 1)
            augment += ' (Plastique)';
          else if (aug.rating === 2)
            augment += ' (Aluminium)';
          else if (aug.rating === 3)
            augment += ' (Titanium)';
        }
        else if (aug.hasOwnProperty('rating')) {
          augment += ' ' + aug.rating;
        }

        if (aug.hasOwnProperty('augments')) {
          augment += ' (' + aug.augments.join(', ') + ')';
        }

        augments.push(augment);
      }

      $mook.find('.information .augments .value').html(augments.join(', '));
    }
    else {
      $mook.find('.information .augments').hide();
    }

    // Armor & Damage Resistance
    var soak = parseInt(augmented_attributes.body);

    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Ossature renforcée') {
        if (aug.rating == 1)
          soak += 1;
        else
          soak += 2;
      }

      if (aug.name === 'Augmentation de densité osseuse')
        soak += aug.rating;
    });

    if (data.armor.length !== 0) {
      var armors = db.get_armor_list(), armor;

      if (armors.hasOwnProperty(data.armor)) {
        armor = armors[data.armor];
        $mook.find('.information .armor .value').html(data.armor + ' (' + armor + ')');
      }
    }
    else {
      $mook.find('.information .armor').hide();
    }

    var defense_test = augmented_attributes.reaction + augmented_attributes.intuition;
    $mook.find('.information .defense_test .value').html(defense_test);
    $mook.find('.information .defense_test button').button().click(function () {
      var d = defense_test;

      if (wp.penalty !== 0)
        d += wp.penalty;

      var i = roll.d(d), total = i.hits;

      $mook.find('.information .defense_test .result').html(total);
    });

    // Block & Dodge roll
    var block = 0, dodge = 0;
    for (skill in data.skills) {
      if (skill == 'Combat rapproché') block = data.skills[skill] + defense_test;
      if (skill == 'Athlétisme') dodge = data.skills[skill] + defense_test;
    }

    if (block > 0) {
      $mook.find('.information .defense_test_block .value').html(block);
      $mook.find('.information .defense_test_block button').button().click(function () {
        var d = block;
  
        if (wp.penalty !== 0)
          d += wp.penalty;
  
        var i = roll.d(d), total = i.hits;
  
        $mook.find('.information .defense_test_block .result').html(total);
      });
    } else {
      $mook.find('.information .defense_test_block').hide();
    }

    if (dodge > 0) {
      $mook.find('.information .defense_test_dodge .value').html(dodge);
      $mook.find('.information .defense_test_dodge button').button().click(function () {
        var d = dodge;
  
        if (wp.penalty !== 0)
          d += wp.penalty;
  
        var i = roll.d(d), total = i.hits;
  
        $mook.find('.information .defense_test_dodge .result').html(total);
      });
    } else {
      $mook.find('.information .defense_test_dodge').hide();
    }


    // Dodge roll

    $mook.find('.information .damage_resistance .value').html(soak);
    $mook.find('.information .damage_resistance button').button().click(function () {
      var i = roll.d(soak), total = i.hits;

      $mook.find('.information .damage_resistance .result').html(total);
    });

    // Weapons & Gear & Commlink
    var gear = [], melee = [], ranged = [], entry_text, entry, $gear;

    for (i in data.weapons) {
      // clone object
      var weapon;

      if (typeof data.weapons[i] === 'string')
        weapon = db.get_weapon(data.weapons[i]);
      else
        weapon = $.extend(db.get_weapon(data.weapons[i].name), data.weapons[i]);

      if (weapon.type === 'Melee')
        melee.push(weapon);
      else
        ranged.push(weapon);
    }

    for (i in melee) {
      entry = melee[i];

      entry_text = [entry.ability];

      if (entry.weapon_focus)
        entry_text.push('Focus d\'arme');

      if (entry.hasOwnProperty('force'))
        entry_text.push('Puissance ' + entry.force);

      if (entry.damage_attribute === 'strength')
        entry_text.push('VD (FOR + ' + entry.dv + ')' + entry.damage_type);
      else
        entry_text.push('VD ' + entry.dv + entry.damage_type);

      entry_text.push('SO ' + entry.ar);
      // if (entry.ap !== 0)
      // 	entry_text.push('AP ' + entry.ap);

      $gear = render.get_template('display_weapon').appendTo($mook.find('.information .gear .value'));

      $gear.find('.stats').html(entry.name + ' [' + entry_text.join(', ') + ']');

      $mook.find('.skill_list > div').each(function () {
        if (entry.ability === $(this).prop('skill'))
          $gear.prop('pool', $(this).prop('pool'));
      });

      if ($gear.prop('pool') === undefined) {
        $gear.prop('pool', (augmented_attributes.agility - 1));
      }

      if (entry.hasOwnProperty('force'))
        $gear.prop('pool', $gear.prop('pool') + entry.force);

      $gear.find('button').button().click(function () {
        var $gear = $(this).parent();
        var d = $gear.prop('pool'), i = roll.d(d), total = i.hits;

        if (wp.penalty !== 0) {
          if ((d + wp.penalty) <= 0) {
            $gear.find('.result').html('N/A');
            return;
          }

          i = roll.d(d + wp.penalty);
          total = i.hits;
        }

        if (i.glitch)
          total += ',g';
        else if (i.crit_glitch)
          total += ',G';

        $gear.find('.result').html(total);
      });
    }

    // Cyber-implanted Spur is a special case
    var has_spur = false;

    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Lames d\'avant-bras')
        has_spur = true;
    });

    if (has_spur) {
      entry = db.get_weapon('Lames d\'avant-bras');

      entry_text = [entry.ability];

      if (entry.damage_attribute === 'strength')
        entry_text.push('VD (FOR + ' + entry.dv + ')' + entry.damage_type);
      else
        entry_text.push('VD ' + entry.dv + entry.damage_type);

      // if (entry.ap !== 0)
      // 	entry_text.push('AP ' + entry.ap);
      entry_text.push('SO ' + entry.ar);

      $gear = render.get_template('display_weapon').appendTo($mook.find('.information .gear .value'));

      $gear.find('.stats').html(entry.name + ' [' + entry_text.join(', ') + ']');

      $mook.find('.skill_list > div').each(function () {
        if (entry.ability === $(this).prop('skill'))
          $gear.prop('pool', $(this).prop('pool'));
      });

      if ($gear.prop('pool') === undefined) {
        $gear.prop('pool', (augmented_attributes.agility - 1));
      }

      $gear.find('button').button().click(function () {
        var $gear = $(this).parent();
        var d = $gear.prop('pool'), i = roll.d(d), total = i.hits;

        if (wp.penalty !== 0) {
          if ((d + wp.penalty) <= 0) {
            $gear.find('.result').html('N/A');
            return;
          }

          i = roll.d(d + wp.penalty);
          total = i.hits;
        }

        if (i.glitch)
          total += ',g';
        else if (i.crit_glitch)
          total += ',G';

        $gear.find('.result').html(total);
      });
    }

    for (i in ranged) {
      entry = ranged[i];

      entry_text = [entry.type];

      // if (entry.acc_modified !== null)
      // 	entry_text.push('Acc ' + entry.acc + ' (' + entry.acc_modified + ')');
      // else
      // 	entry_text.push('Acc ' + entry.acc);

      if (entry.damage_attribute === 'strength')
        entry_text.push('VD (FOR + ' + entry.dv + ')' + entry.damage_type);
      else
        entry_text.push('VD ' + entry.dv + entry.damage_type);

      // if (entry.ap !== 0)
      // 	entry_text.push('AP ' + entry.ap);

      entry_text.push(entry.modes);

      entry_text.push('SO ' + entry.ar);

      // if (entry.rc < entry.rc_modified)
      // 	entry_text.push('RC ' + entry.rc + ' (' + entry.rc_modified + ')');
      // else
      // 	entry_text.push('RC ' + entry.dv);

      entry_text.push(entry.ammo_count + '(' + entry.reload + ')');

      if (entry.ammo_type !== '')
        entry_text.push('w/' + entry.ammo_type + ' ammo');

      // gear.push('<div>' + entry.name + ' [' + entry_text.join(', ') + ']</div>');
      $gear = render.get_template('display_weapon').appendTo($mook.find('.information .gear .value'));

      $gear.find('.stats').html(entry.name + ' [' + entry_text.join(', ') + ']');

      $mook.find('.skill_list > div').each(function () {
        if (entry.ability === $(this).prop('skill'))
          $gear.prop('pool', $(this).prop('pool'));
      });

      if ($gear.prop('pool') === undefined) {
        $gear.prop('pool', (augmented_attributes.agility - 1));
      }

      $gear.find('button').button().click(function () {
        var $gear = $(this).parent();
        var d = $gear.prop('pool'), i = roll.d(d), total = i.hits;

        if (wp.penalty !== 0) {
          if ((d + wp.penalty) <= 0) {
            $gear.find('.result').html('N/A');
            return;
          }

          i = roll.d(d + wp.penalty);
          total = i.hits;
        }

        if (i.glitch)
          total += ',complication';
        else if (i.crit_glitch)
          total += ',Echec critique';

        $gear.find('.result').html(total);
      });
    }

    // Gear
    var complex_gear = [], item, item_display;

    for (i in data.gear) {
      if (typeof data.gear[i] === 'string') {
        // TODO this shouldn't happen anymore
        debugger;
        continue;
      }

      if (data.gear[i].type === 'cyberdeck') {
        switch (data.gear[i].rating) {
          default:
          case 1:
            complex_gear.push('Erika MCD-1 cyberdeck (Indice 1, Atts 4 3 2 1, Programme 1)');
            break;
          case 2:
            complex_gear.push('Hermes Chariot cyberdeck (Indice 2, Atts 5 4 3 2, Programmes 2)');
            break;
          case 5:
            complex_gear.push('Shiawase Cyber-5 cyberdeck (Indice 5, Atts 8 7 6 5, Programmes 5)');
            break;
        }
      }
      else if (data.gear[i].name === 'Focus Qi') {
        complex_gear.push('Focus Qi (Puissance ' + data.gear[i].force + ', ' + data.gear[i].power + ' ' + data.gear[i].rating + ')');
      }
      else {
        item = data.gear[i];
        item_display = item.name;

        if (item.hasOwnProperty('rating')) {
          item_display += ' indice ' + item.rating + '';
        }

        if (item.hasOwnProperty('quantity')) {
          item_display += ' (' + item.quantity + ')';
        }

        if (item.hasOwnProperty('augments')) {
          item_display += ' [' + item.augments.join(', ') + ']';
        }


           if (item.hasOwnProperty('gear_description')) {
            item_display += ' : ' + item.gear_description;
          }

        complex_gear.push(item_display);
      }
    }

    for (i in complex_gear) {
      gear.push("<div>" + complex_gear[i] + "</div>");
    }

    // Commlink
    var commlink = '';

    switch (data.commlink) {
      default:
      case 1:
        commlink = 'Meta Link';
        break;
      case 2:
        commlink = 'Sony Emperor';
        break;
      case 3:
        commlink = 'Renraku Sensei';
        break;
      case 4:
        commlink = 'Erika Elite';
        break;
      case 5:
        commlink = 'Hermes Ikon';
        break;
      case 6:
        commlink = 'Transys Avalon';
    }

    commlink += ' commlink (Indice ' + data.commlink + ')';

    commlink = '<div>' + commlink + '</div>';

    gear.push(commlink);

    for (i in gear) {
      $mook.find('.information .gear .value').append($(gear[i]));
    }

    // Adept Powers
    if (data.special.is_adept === true) {
      var powers = [], power;

      for (i in data.special.powers) {
        power = data.special.powers[i].name;

        if (data.special.powers[i].hasOwnProperty('ability')) {
          power += ' (' + data.special.powers[i].ability + ')';
        }

        if (data.special.powers[i].hasOwnProperty('attribute')) {
          power = data.special.powers[i].attribute + ' améliorée ';
        }

        power += ' ' + data.special.powers[i].rating;

        if (data.special.powers[i].hasOwnProperty('power_description')) {
          power += ' : ' + data.special.powers[i].power_description;
        }


        powers.push(power);
      }

      $mook.find('.information .powers .value').html(powers.join('<br>'));
    }
    else {
      $mook.find('.information .powers').hide();
    }

    // Mage spells
    if (data.special.is_mage === true || data.special.is_shaman === true)
    {
      var spells = [], spell;

      for (i in data.special.spells) {
        spell = data.special.spells[i].name;
      
        spell += ' (' + data.special.spells[i].type + ' ⚟ ' + data.special.spells[i].portee + ' 🕗 ' + data.special.spells[i].duree + ' ⚠ ' + data.special.spells[i].drain + ') : ' + data.special.spells[i].description + '';

        spells.push(spell);
      }
      $mook.find('.information .spells .value').html(spells.join('<br>'));
    }
    else
    {
      $mook.find('.information .spells').hide();
    }

    // Decker Programs
    if (data.special.is_decker === true) {
      // Find the deck in the gear, get the programs from it
      var deck;

      for (i in data.gear) {
        if (data.gear[i].hasOwnProperty('type') && data.gear[i].type === 'cyberdeck') {
          deck = data.gear[i];
        }
      }

      $mook.find('.information .programs .value').html(deck.programs.join(', '));
    }
    else {
      $mook.find('.information .programs').hide();
    }
  },

  mook_for_display: function ($target, data, options) {
    // Given a target, nuke all contents and make a pretty rendering attached to the target
    // will need to calculate augmented attributes and damage resistance pool
    var i, $mook = render.get_template('render__display_npc');

    options = $.extend({}, options);

    $target.empty().append($mook);

    // Fill in the name and description
    if (data.edited) {
      $mook.find('.npc_name').html(data.name + ' -- ' + data.race + ' ' + data.gender + ',  ' + data.professional_description + ' - Professionalisme ' + data.professional_rating);

      $mook.find('.npc_description').hide();
    }
    else {
      $mook.find('.npc_name').html(data.name);

      var description = data.race + ' ' + data.gender + ',  ' + data.professional_description + ' - Professionalisme ' + data.professional_rating;

      if (data.special.is_lt)
        description += ' - Lieutenant';
      if (data.special.is_decker)
        description += ' - Decker';
      if (data.special.is_adept)
        description += ' - Adepte';
      if (data.special.is_mage)
        description += ' - Magicien';
      if (data.special.is_shaman)
        description += ' - Shaman';

      $mook.find('.npc_description').html(description);
    }

    // Fill in notes if there are any
    if (data.notes) {
      $mook.find('.npc_notes').html(data.notes);
    }
    else {
      $mook.find('.npc_notes').hide();
    }

    // Base Attributes
    var augmented_attributes = this.calc_augmented_attributes(data);
    var base_attributes = ['body', 'agility', 'reaction', 'strength', 'will', 'logic', 'intuition', 'charisma'];

    base_attributes.forEach(function (i) {
      var a = data.attributes[i];
      if (augmented_attributes[i] !== data.attributes[i]) {
        a += ' (' + augmented_attributes[i] + ')';
      }
      $mook.find('.attribute_values .attribute_value.' + i).html(a);
    });

    // Essence
    // Working around display issues of whole numbers vs repeating numbers
    if (augmented_attributes.essence % 1 === 0) {
      $mook.find('.attribute_values .attribute_value.essence').html(augmented_attributes.essence);
    }
    else if ((augmented_attributes.essence * 10) % 1 === 0) {
      $mook.find('.attribute_values .attribute_value.essence').html(augmented_attributes.essence.toFixed(1));
    }
    else {
      $mook.find('.attribute_values .attribute_value.essence').html(augmented_attributes.essence.toFixed(2));
    }

    // Set/Hide Magic
    if (data.special.hasOwnProperty('Magic')) {
      $mook.find('.attribute_values .attribute_value.magic').html(data.special.Magic);
    }
    else {
      $mook.find('.attribute_name.magic, .attribute_value.magic').hide();
    }

    // Initiative
    var initiative = this.calc_initiative(data, augmented_attributes);

    var init_display = initiative.base + ' ';

    if (initiative.base !== initiative.base_augmented) {
      init_display += '(' + initiative.base_augmented + ') ';
    }

    init_display += '+ ' + initiative.dice + 'D6';

    if (initiative.base !== initiative.base_augmented) {
      init_display += ' (' + initiative.dice_augmented + 'D6)';
    }

    // Major and Minor actions
    var major = 1, minor = initiative.dice_augmented;

    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Réflexes câblés' || aug.name === 'Amplificateur synaptique') {
        minor += aug.rating;
      }
    });

    init_display += ' [Majeure ' + major + '/mineure ' + minor + ']';

    $mook.find('.information .initiative .value').html(init_display);

    if (data.special.is_decker === true) {
      initiative = this.calc_initiative(data, augmented_attributes, 'matricielle');
      $mook.find('.information .matrix_initiative .value').html('Traitement de données + ' + initiative.base + ' + ' + initiative.dice + 'D6');
    }
    else {
      $mook.find('.information .matrix_initiative').hide();
    }

    if (data.special.is_mage === true || data.special.is_shaman === true) {
      initiative = this.calc_initiative(data, augmented_attributes, 'astral');
      $mook.find('.information .astral_initiative .value').html(initiative.base + ' + ' + initiative.dice + 'D6');
    }
    else {
      $mook.find('.information .astral_initiative').hide();
    }

    // Defense Rating
    var defense_rating = parseInt(augmented_attributes.body);

    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Armure dermique' || aug.name === 'Orthoderme') {
        defense_rating += aug.rating;
      }

      if (aug.name === 'Ossature renforcée') {
        if (aug.rating == 3)
          defense_rating += 2;
        else
          defense_rating += 1;
      }
    });

    if (data.armor.length !== 0) {
      var armors = db.get_armor_list(), armor;

      if (armors.hasOwnProperty(data.armor)) {
        armor = armors[data.armor];
        defense_rating += armor;
      }
    }

    $mook.find('.information .defense_rating .value').html(defense_rating);

    // Defense Test
    var defense_test = parseInt(augmented_attributes.reaction) + parseInt(augmented_attributes.intuition);
    var block = defense_test, dodge = defense_test;
    for (skill in data.skills) {
      if (skill == 'Combat rapproché') block += data.skills[skill];
      if (skill == 'Athlétisme') dodge += data.skills[skill];
    }
    var defense_display = 'Base ' + defense_test + ' / Bloquer ' + block + ' / Esquiver ' + dodge;
    $mook.find('.information .defense_test .value').html(defense_display);

    // Condition Monitor
    var cm = data.attributes.body > data.attributes.will ? data.attributes.body : data.attributes.will;
    cm = 8 + roll.half(cm);

    // Add in the bonus for having cyberlimbs
    var cyberlimbs = data.augmentations.filter(function (aug) {
      return aug.hasOwnProperty('type') && aug.type === 'full cyberlimb';
    });
    cm += cyberlimbs.length;

    $mook.find('.information .condition_monitor .value').html(cm);

    // Qualities
    if (data.qualities.positive.length === 0 && data.qualities.negative.length === 0) {
      $mook.find('.information .qualities').hide();
    }
    else {
      $mook.find('.information .qualities .value').html(data.qualities.positive.concat(data.qualities.negative).join(', '));
    }

    // Initiate Grade
    if (data.special.hasOwnProperty('Initié')) {
      $mook.find('.information .initiate_grade .value').html(data.special.Initiate);
    }
    else {
      $mook.find('.information .initiate_grade').hide();
    }

    // Skills
    var skills = [], improved_skills = [], improved_rating = 0;

    // TODO This only really accounts for 1 improved ability, but that's all that is generated right now
    if (data.special.is_adept === true) {
      for (i in data.special.powers) {
        var improved_power = data.special.powers[i];

        if (improved_power.name === 'Compétence améliorée') {
          improved_skills.push(improved_power.ability);

          improved_rating = improved_rating < improved_power.rating ? improved_power.rating : improved_rating;
        }
      }
    }

    for (var skill in data.skills) {
      if (data.skills[skill] > 0) {
        if (improved_skills.includes(skill))
          skills.push(skill + ' ' + data.skills[skill] + ' (' + (data.skills[skill] + improved_rating) + ')');
        else
          skills.push(skill + ' ' + data.skills[skill]);
      }
    }

    $mook.find('.information .skills .value').html(skills.join(', '));

    // Augmentations
    if (data.augmentations.length) {
      var augments = [], augment, aug;

      for (i in data.augmentations) {
        aug = data.augmentations[i];

        if (typeof aug === 'string') {
          augments.push(aug);
          continue;
        }

        augment = aug.name;

        if (aug.name === 'Ossature renforcée') {
          if (aug.rating === 1)
            augment += ' (Plastique)';
          else if (aug.rating === 2)
            augment += ' (Aluminium)';
          else if (aug.rating === 3)
            augment += ' (Titanium)';
        }
        else if (aug.hasOwnProperty('rating')) {
          augment += ' ' + aug.rating;
        }

        if (aug.hasOwnProperty('augments')) {
          augment += ' (' + aug.augments.join(', ') + ')';
        }

        augments.push(augment);
      }

      $mook.find('.information .augments .value').html(augments.join(', '));
    }
    else {
      $mook.find('.information .augments').hide();
    }

    // Armor & Damage Resistance
    var soak = parseInt(augmented_attributes.body);

    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Ossature renforcée') {
        if (aug.rating == 1)
          soak += 1;
        else
          soak += 2;
      }

      if (aug.name === 'Augmentation de densité osseuse')
        soak += aug.rating;
    });

    if (data.armor.length !== 0) {
      var armors = db.get_armor_list(), armor;

      if (armors.hasOwnProperty(data.armor)) {
        armor = armors[data.armor];
        $mook.find('.information .armor .value').html(data.armor + ' (' + armor + ')');
      }
    }
    else {
      $mook.find('.information .armor').hide();
    }

    $mook.find('.information .damage_resistance .value').html(soak);

    // Weapons & Gear & Commlink
    var gear = [], melee = [], ranged = [], entry_text, entry;

    for (i in data.weapons) {
      // clone object
      var weapon;

      if (typeof data.weapons[i] === 'string')
        weapon = db.get_weapon(data.weapons[i]);
      else
        weapon = $.extend(db.get_weapon(data.weapons[i].name), data.weapons[i]);

      if (weapon.type === 'Melee')
        melee.push(weapon);
      else
        ranged.push(weapon);
    }

    for (i in melee) {
      entry = melee[i];

      entry_text = [entry.ability];

      if (entry.weapon_focus)
        entry_text.push('Focus d\'arme');

      if (entry.hasOwnProperty('force'))
        entry_text.push('Puissance ' + entry.force);

      // if (entry.acc_modified !== null)
      // 	entry_text.push('Acc ' + entry.acc + ' (' + entry.acc_modified + ')');
      // else
      // 	entry_text.push('Acc ' + entry.acc);

      if (entry.damage_attribute === 'strength')
        entry_text.push('VD (FOR + ' + entry.dv + ')' + entry.damage_type);
      else
        entry_text.push('VD ' + entry.dv + entry.damage_type);

      entry_text.push('SO ' + entry.ar);

      // if (entry.ap !== 0)
      // 	entry_text.push('AP ' + entry.ap);

      gear.push('<div>' + entry.name + ' [' + entry_text.join(', ') + ']</div>');
    }

    // Cyber-implanted Spur is a special case
    var has_spur = false;
    data.augmentations.forEach(function (aug) {
      if (aug.name === 'Lames d\'avant-bras')
        has_spur = true;
    });
    if (data.augmentations.includes('Lames d\'avant-bras') || has_spur) {
      entry = db.get_weapon('Lames d\'avant-bras');

      entry_text = [entry.ability];

      // if (entry.damage_attribute === 'strength')
      // 	entry_text.push('VD (FOR + ' + entry.dv + ')' + entry.damage_type);
      // else
      entry_text.push('VD ' + entry.dv + entry.damage_type);

      entry_text.push('SO ' + entry.ar);

      // if (entry.ap !== 0)
      // 	entry_text.push('AP ' + entry.ap);

      gear.push('<div>Lames d\'avant-bras [' + entry_text.join(', ') + ']</div>');
    }

    for (i in ranged) {
      entry = ranged[i];

      entry_text = [entry.type];

      // if (entry.acc_modified !== null)
      // 	entry_text.push('Acc ' + entry.acc + ' (' + entry.acc_modified + ')');
      // else
      // 	entry_text.push('Acc ' + entry.acc);

      // if (entry.damage_attribute === 'strength')
      // 	entry_text.push('VD (FOR + ' + entry.dv + ')' + entry.damage_type);
      // else
      entry_text.push('VD ' + entry.dv + entry.damage_type);

      // if (entry.ap !== 0)
      // 	entry_text.push('AP ' + entry.ap);

      entry_text.push(entry.modes);

      entry_text.push('SO ' + entry.ar);

      // if (entry.rc < entry.rc_modified)
      // 	entry_text.push('RC ' + entry.rc + ' (' + entry.rc_modified + ')');
      // else
      // 	entry_text.push('RC ' + entry.dv);

      entry_text.push(entry.ammo_count + '(' + entry.reload + ')');

      if (entry.ammo_type !== '')
        entry_text.push('avec ' + entry.ammo_type + ' mun.');

      gear.push('<div>' + entry.name + ' [' + entry_text.join(', ') + ']</div>');
    }

    // Gear
    var complex_gear = [], item, item_display;

    for (i = 0; i < data.gear.length; i++) {
      if (data.gear[i].type === 'cyberdeck') {
        switch (data.gear[i].rating) {
          default:
          case 1:
            complex_gear.push('Erika MCD-1 cyberdeck (Indice 1, Atts 4 3 2 1, Programmes 1)');
            break;
          case 2:
            complex_gear.push('Hermes Chariot cyberdeck (Indice 2, Atts 5 4 3 2, Programmes 2)');
            break;
          case 5:
            complex_gear.push('Shiawase Cyber-5 cyberdeck (Indice 5, Atts 8 7 6 5, Programmes 5)');
            break;
        }
      }
      else if (data.gear[i].name === 'Focus Qi') {
        complex_gear.push('Focus Qi (Puissance ' + data.gear[i].force + ', ' + data.gear[i].power + ' ' + data.gear[i].rating + ')');
      }
      else {
        item = data.gear[i];
        item_display = item.name;

        if (item.hasOwnProperty('rating')) {
          item_display += ' indice ' + item.rating + '';
        }

        if (item.hasOwnProperty('quantity')) {
          item_display += ' (' + item.quantity + ')';
        }

        if (item.hasOwnProperty('augments')) {
          item_display += ' [' + item.augments.join(', ') + ']';
        }

        complex_gear.push(item_display);
      }
    }

    for (i in complex_gear) {
      gear.push("<div>" + complex_gear[i] + "</div>");
    }

    // Commlink
    var commlink = '';

    switch (data.commlink) {
      default:
      case 1:
        commlink = 'Meta Link';
        break;
      case 2:
        commlink = 'Sony Emperor';
        break;
      case 3:
        commlink = 'Renraku Sensei';
        break;
      case 4:
        commlink = 'Erika Elite';
        break;
      case 5:
        commlink = 'Hermes Ikon';
        break;
      case 6:
        commlink = 'Transys Avalon';
    }

    commlink += ' (indice ' + data.commlink + ')';

    commlink = '<div> Commlink : ' + commlink + '</div>';

    gear.push(commlink);

    $mook.find('.information .gear .value').html(gear.join(''));

    // Adept Powers
    if (data.special.is_adept === true) {
      var powers = [], power;

      for (i in data.special.powers) {
        power = data.special.powers[i].name;

        if (data.special.powers[i].hasOwnProperty('ability')) {
          power += ' (' + data.special.powers[i].ability + ')';
        }

        if (data.special.powers[i].hasOwnProperty('attribute')) {
          power = data.special.powers[i].attribute + ' améliorée';
        }

        power += ' ' + data.special.powers[i].rating;

        powers.push(power);
      }

      $mook.find('.information .powers .value').html(powers.join(', '));
    }
    else {
      $mook.find('.information .powers').hide();
    }

    // Mage spells
    if (data.special.is_mage === true || data.special.is_shaman === true)
    {
            var spells = [], spell;

      for (i in data.special.spells) {
        spell = data.special.spells[i].name;

        spells.push(spell);
      }

      $mook.find('.information .spells .value').html(spells.join(', '));
    }
    else
    {
      $mook.find('.information .spells').hide();
    }

    // Decker Programs
    if (data.special.is_decker === true) {
      // Find the deck in the gear, get the programs from it
      var deck;

      for (i in data.gear) {
        if (data.gear[i].hasOwnProperty('type') && data.gear[i].type === 'cyberdeck') {
          deck = data.gear[i];
        }
      }

      $mook.find('.information .programs .value').html(deck.programs.join(', '));
    }
    else {
      $mook.find('.information .programs').hide();
    }

    // Add buttons to enter other modes
    $mook.find('button').button();

    $mook.find('.controls button.action').click(function () {
      render.mook_for_action($target, data, options);
    });

    $mook.find('.controls button.edit').click(function () {
      options.view_after_save = 'display';
      render.mook_for_edit($target, data, options);
    });
  },

  calc_augmented_attributes: function (data) {
    var attr = $.extend({}, data.attributes);

    attr.essence = 6;

    // Attribute Augmentation
    data.augmentations.forEach(function (aug) {
      var name = aug;

      if (aug.hasOwnProperty('name'))
        name = aug.name;

      // Handle essence loss
      switch (name) {
        case 'Réflexes câblés':
          if (aug.rating === 1)
            attr.essence -= 2;
          else if (aug.rating === 2)
            attr.essence -= 3;
          else if (aug.rating === 3)
            attr.essence -= 5;
          break;

        case 'Cyberyeux':
          attr.essence -= (0.1 + aug.essence * aug.rating);
          break;

        default:
          if (aug.hasOwnProperty('rating') && aug.hasOwnProperty('essence')) {
            attr.essence -= aug.rating * aug.essence;
          }
          else if (aug.hasOwnProperty('essence')) {
            attr.essence -= aug.essence;
          }
          break;
      }

      // Handle attribute changes
      switch (name) {
        case 'Muscle Augmentation':
          attr.strength += aug.rating;
          break;

        case 'Tonification musculaire':
          attr.agility += aug.rating;
          break;

        case 'Cervelet amplifié':
          attr.intuition += aug.rating;
          break;

        case 'Amplificateur cérébral':
          attr.logic += aug.rating;
          break;

        case 'Réflexes câblés':
          attr.reaction += aug.rating;
          break;

        case 'Amplificateur synaptique':
          attr.reaction += aug.rating;
          break;

        case 'Jazz (Active)':
          attr.reaction++;
          break;

        case 'Kamikaze (Active)':
          attr.body++;
          attr.agility++;
          attr.strength += 2;
          attr.will++;
          break;

        case 'Kamikaze (Crash)':
          attr.reaction--;
          attr.will--;
          break;

        case 'Novacoke (Active)':
          attr.charisma++;
          attr.reaction++;
          break;

        case 'Novacoke (Crash)':
          attr.reaction -= 20;
          attr.charisma -= 20;
          break;

        case 'Psyche (Active)':
          attr.intuition++;
          attr.logic++;
          break;
      }
    });

    if (data.special.hasOwnProperty('powers')) {
      data.special.powers.forEach(function (power) {
        switch (power.name) {
          case 'Réflexes améliorés':
            attr.reaction += power.rating;
            break;

          case 'Attribut amélioré':
            attr[power.attribute.toLowerCase()] += power.rating;
            break;
        }
      });

      // Also look through the gear section for Qi Foci
      for (var i in data.gear) {
        if (data.gear[i].hasOwnProperty('name') && data.gear[i].name === 'Qi Focus') {
          var focus = data.gear[i];

          if (focus.hasOwnProperty('type') && focus.type === 'Attribut amélioré') {
            attr[focus.attribute] += focus.rating;
          }
        }
      }
    }

    // No cyber-zombies
    if (attr.essence <= 0) {
      attr.essence = 0.1;
    }

    return attr;
  },

  calc_initiative: function (data, augmented_attributes, mode) {
    var base = data.attributes.reaction + data.attributes.intuition;

    var base_aug = augmented_attributes.reaction + augmented_attributes.intuition;

    var dice = 1;

    var dice_aug = 1;

    if (mode === 'astral') {
      base = data.attributes.intuition * 2;
      base_aug = augmented_attributes.intuition * 2;
      dice = 2;
    }
    else if (mode === 'matrix') {
      // The display is difference because it is deck-config dependant
      base = data.attributes.intuition;
      base_aug = augmented_attributes.intuition;
      dice = 4;
    }
    else {
      data.augmentations.forEach(function (aug) {
        switch (aug.name) {
          case 'Réflexes câblés':
          case 'Amplificateur synaptique':
            dice_aug += aug.rating;
            break;
        }
      });

      if (data.special.hasOwnProperty('powers')) {
        data.special.powers.forEach(function (power) {
          switch (power.name) {
            case 'Réflexes améliorés':
              dice_aug += power.rating;
              break;
          }
        });
      }
    }

    return {
      base: base,
      base_augmented: base_aug,
      dice: dice,
      dice_augmented: dice_aug
    }
  },

  get_templates: function () {
    render.templates = $('div[template_holder]').detach();
  },

  get_template: function (template) {
    var ret = $(render.templates).find('div[template="' + template + '"]').clone();

    if (!ret.length) {
      console.warn('Failed to locate template "' + template + '"');
      return null;
    }

    ret.removeAttr('template');

    return ret;
  },

  get_condition_monitor: function (wp, data) {
    if (data.condition_monitor === 'combined') {
      return this.get_condition_monitor_combined(wp, data);
    }
    else if (data.condition_monitor === 'separate') {
      return this.get_condition_monitor_separate(wp, data);
    }
  },

  get_condition_monitor_combined: function (wp, data) {
    var $cm = this.get_template('condition_monitor_combined'), i, $box, $marker, $mark;
    var box_count = 8 + roll.half(data.attributes.body > data.attributes.will ? data.attributes.body : data.attributes.will);
    var frequency = data.wound_penalty, total_penalty = 0, guid = this.guid();

    // Add in the bonus for having cyberlimbs
    var cyberlimbs = data.augmentations.filter(function (aug) {
      return aug.hasOwnProperty('type') && aug.type === 'full cyberlimb';
    });
    box_count += cyberlimbs.length;

    $cm.prop('guid', guid);

    for (i = 0; i <= box_count; i++) {
      $box = $('<div/>').appendTo($cm.find('.boxes'));
      $marker = $('<div/>').appendTo($cm.find('.markers'));
      $mark = $('<input type="radio"/>').appendTo($marker);

      $mark.attr('name', 'condition_monitor_' + guid);
      $mark.attr('id', i);
      $mark.click(function () {
        wp.penalty = parseInt($(this).prop('penalty'));
        if (isNaN(wp.penalty))
          wp.penalty = 0;
        $cm.find('.penalty').html('Malus : ' + wp.penalty);
      });

      // Add a visual to the boxes
      if (i === 0) {
        $box.html('X');
        $mark.click();
      }
      else if (frequency === '1') {
        total_penalty--;
        $box.html(total_penalty);
      }
      else if (frequency === '2' || frequency === '3') {
        if ((i % frequency) === 0) {
          total_penalty--;
          $box.html(total_penalty);
        }
      }
      else {
        $box.html('&nbsp;');
      }

      $mark.prop('penalty', total_penalty);
    }

    $cm.find('.penalty').html('');
    return $cm;
  },

  get_condition_monitor_separate: function (wp, data) {
    var $cm = this.get_template('condition_monitor_separate'), i, $box, $marker, $mark;
    var frequency = data.wound_penalty, total_penalty = 0, guid = this.guid(), box_count;

    if (!wp.hasOwnProperty('physical')) {
      wp.physical = 0;
    }

    if (!wp.hasOwnProperty('stun')) {
      wp.stun = 0;
    }

    box_count = 8 + roll.half(data.attributes.body);

    // Add in the bonus for having cyberlimbs
    var cyberlimbs = data.augmentations.filter(function (aug) {
      return aug.hasOwnProperty('type') && aug.type === 'full cyberlimb';
    });
    box_count += cyberlimbs.length;

    for (i = 0; i <= box_count; i++) {
      $box = $('<div/>').appendTo($cm.find('.physical.boxes'));
      $marker = $('<div/>').appendTo($cm.find('.physical.markers'));
      $mark = $('<input type="radio"/>').appendTo($marker);

      $mark.attr('name', 'condition_monitor_physical_' + guid);
      $mark.attr('id', i);
      $mark.click(function () {
        wp.physical = parseInt($(this).prop('penalty'));
        if (isNaN(wp.physical))
          wp.physical = 0;
        wp.penalty = wp.physical + wp.stun;
        $cm.find('.penalty').html('Malus : ' + wp.penalty);
      });

      // Add a visual to the boxes
      if (i === 0) {
        $box.html('P');
        $mark.click();
      }
      else if (frequency === '1') {
        total_penalty--;
        $box.html(total_penalty);
      }
      else if (frequency === '2' || frequency === '3') {
        if ((i % frequency) === 0) {
          total_penalty--;
          $box.html(total_penalty);
        }
      }
      else {
        $box.html('&nbsp;');
      }

      $mark.prop('penalty', total_penalty);
    }

    box_count = 8 + roll.half(data.attributes.will);
    total_penalty = 0;
    for (i = 0; i <= box_count; i++) {
      $box = $('<div/>').appendTo($cm.find('.stun.boxes'));
      $marker = $('<div/>').appendTo($cm.find('.stun.markers'));
      $mark = $('<input type="radio"/>').appendTo($marker);

      $mark.attr('name', 'condition_monitor_stun_' + guid);
      $mark.attr('id', i);
      $mark.click(function () {
        wp.stun = parseInt($(this).prop('penalty'));
        if (isNaN(wp.stun))
          wp.stun = 0;
        wp.penalty = wp.physical + wp.stun;
        $cm.find('.penalty').html('Malus : ' + wp.penalty);
      });

      // Add a visual to the boxes
      if (i === 0) {
        $box.html('E');
        $mark.click();
      }
      else if (frequency === '1') {
        total_penalty--;
        $box.html(total_penalty);
      }
      else if (frequency === '2' || frequency === '3') {
        if ((i % frequency) === 0) {
          total_penalty--;
          $box.html(total_penalty);
        }
      }
      else {
        $box.html('&nbsp;');
      }

      $mark.prop('penalty', total_penalty);
    }

    $cm.find('.penalty').html('');
    return $cm;
  },

  equalize_widths: function ($elems) {
    var widest = 0;
    $elems.each(function () {
      widest = $(this).width() > widest ? ($(this).width() + 30) : widest;
    }).width(widest);
  },

  format_string_date: function (date_string, format) {
    var ret, date_obj = new Date(date_string);

    switch (format) {
      default:
        ret = date_obj.toLocaleString();
        break;
    }

    return ret;
  },

  guid: function () {
    return 'xxxxxxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }
    );
  }
};
