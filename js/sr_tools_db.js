var db = {
  // Generate a random race
  gen_race: function () {
    var r = roll.dval(100), res;

    switch (true) {
      case (r < 40):
        res = 'Humain';
        break;

      case (r < 65):
        res = 'Ork';
        break;

      case (r < 80):
        res = 'Elfe';
        break;

      case (r < 95):
        res = 'Nain';
        break;

      default:
        res = 'Troll';
    }

    return res;
  },

  get_base_attributes: function (rating) {
    var res = {};

    switch (rating) {
      case 0:
        res.attributes = { body: 3, agility: 3, reaction: 2, strength: 2, will: 3, logic: 2, intuition: 3, charisma: 2 };
        break;

      case 1:
        res.attributes = { body: 3, agility: 3, reaction: 3, strength: 2, will: 3, logic: 3, intuition: 3, charisma: 2 };
        break;

      case 2:
        res.attributes = { body: 3, agility: 3, reaction: 3, strength: 3, will: 3, logic: 3, intuition: 4, charisma: 2 };
        break;

      case 3:
        res.attributes = { body: 4, agility: 3, reaction: 3, strength: 3, will: 3, logic: 3, intuition: 4, charisma: 3 };
        break;

      case 4:
        res.attributes = { body: 4, agility: 4, reaction: 3, strength: 3, will: 4, logic: 3, intuition: 4, charisma: 3 };
        break;

      case 5:
        res.attributes = { body: 4, agility: 4, reaction: 4, strength: 4, will: 4, logic: 3, intuition: 5, charisma: 3 };
        break;

      case 6:
        res.attributes = { body: 5, agility: 4, reaction: 5, strength: 4, will: 5, logic: 3, intuition: 5, charisma: 3 };
        break;

      default:
        console.log('ERROR: get_base_attributes() with no professional rating');
        break;
    }

    return res;
  },

  get_type_adjustments: function (type, rating) {
    var res = {
      attributes: { body: 0, agility: 0, reaction: 0, strength: 0, will: 0, logic: 0, intuition: 0, charisma: 0 },
      skills: {},
      knowledge_skills: {},
      qualities: {
        positive: [],
        negative: []
      },
      weapons: [],
      armor: '',
      augmentations: [],
      gear: [],
      commlink: 1
    };

    switch (type) {
      case 'civilian':
        res.skills.Perception = 2 + rating;
        res.armor = 'Veste en cuir synth??tique';

        if (roll.dval(6) === 6) {
          res.skills['Armes ?? feu'] = 1 + rating;
          res.armor = 'V??tements pare-balles';
          res.weapons.push('Defiance EX Shocker');
        }
        break;

      case 'thug':
        res.attributes.reaction = 1;
        res.attributes.strength = 1;
        res.skills.Influence = 2 + rating;
        res.skills['Combat rapproch??'] = 2 + rating;
        res.weapons.push('Massue');
        res.weapons.push('Couteau');
        res.armor = 'Veste en cuir synth??tique';

        if (rating > 4 || roll.dval(3) === 3) {
          res.skills['Armes ?? feu'] = 1 + rating;
          res.armor = 'Gilet pare-balles';

          if (rating > 3)
            res.weapons.push('Browning Ultra-Power');
          else
            res.weapons.push('Colt America L36');
        }
        break;

      case 'ganger':
        res.attributes.body = 1;
        res.attributes.agility = 1;
        res.attributes.strength = 2;
        res.attributes.logic = -1;
        res.attributes.charisma = 1;
        res.skills.Influence = 2 + rating;
        res.skills['Armes ?? feu'] = 3 + rating;
        res.skills['Combat rapproch??'] = 2 + rating;
        res.qualities.positive.push('Dur ?? cuire');
        res.armor = 'Manteau renforc??';
        res.weapons.push('Couteau');

        switch (roll.dval(4)) {
          case 1:
            res.weapons.push('Defiance EX Shocker');
            break;

          case 2:
            res.weapons.push('Colt America L36');
            break;

          case 3:
            res.weapons.push('Browning Ultra-Power');
            break;

          case 4:
            res.weapons.push('Ares Predator VI');
            break;
        }


        if (rating > 1 && roll.dval(4) === 4) {
          res.skills.Athl??tisme = 1 + rating;
          res.gear.push({
            name: 'Grenace incapacitante (CS/Lacrymo)',
            quantity: 2
          });
        }
        else if (roll.dval(4) === 4) {
          res.weapons.push('Defiance T-250');
        }

        if (rating > 3) {
          res.armor = 'Veste pare-balles';
        }

        if (rating > 3 && roll.dval(3) === 3) {
          res.augmentations.push({
            name: 'Cyberbras (droit)',
            rating: Math.ceil(rating / 3)
          });
        }

        if (rating > 3 && roll.dval(3) === 1) {
          res.augmentations.push({
            name: 'Cyberbras (gauche)',
          });
            res.augmentations.push({
            name: 'Orthoderme',
            rating: Math.ceil(rating / 3)
          });
        }


        break;

      case 'corpsec':
        res.attributes.body = 1;
        res.attributes.agility = 1;
        res.attributes.reaction = 1;
        res.attributes.logic = -1;
        res.attributes.intuition = -1;
        res.attributes.charisma = 1;
        res.skills.Influence = (rating * 2);
        res.skills.Perception = rating;
        res.skills['Armes ?? feu'] = 2 + rating;
        res.skills.Athl??tisme = 3 + Math.floor(rating / 2);
        res.skills['Combat rapproch??'] = 1 + rating;
        res.commlink = 3;

        if (rating < 2) {
          res.weapons.push('Fichetti Security 600');
          res.weapons.push('Electromatraque');
          res.armor = 'Gilet pare-balles';
        }
        else if (rating < 5) {
          res.weapons.push('Colt Cobra TZ-120');
          res.weapons.push('Fichetti Security 600');
          res.weapons.push('Electromatraque');
          res.armor = 'Veste pare-balles';
        }
        else {
          res.skills.Athl??tisme = 1 + rating;
          res.weapons.push('FN P93 Praetor');
          res.weapons.push('Ares Predator VI');
          res.weapons.push('Electromatraque');
          res.armor = 'Armure corporelle int??grale';
          res.gear.push({
            name: 'Grenade au gaz (CS/Lacrymo)',
            quantity: 2
          });
          res.commlink = 5;
        }
        break;

      case 'police':
        res.attributes.reaction = 1;
        res.attributes.logic = -1;
        res.attributes.intuition = -1;
        res.skills.Perception = rating;
        res.skills['Armes ?? feu'] = 3 + Math.floor(rating / 2);
        res.skills.Athl??tisme = 1 + Math.floor(rating / 2);
        res.skills['Combat rapproch??'] = 1 + rating;
        res.armor = 'Manteau renforc??';
        res.weapons.push('Defiance EX Shocker');
        res.weapons.push('Electromatraque');
        res.gear.push({
          name: 'Lunettes',
          rating: 2,
          augments: ['Interface visuelle', 'Smartlink', 'Vision nocturne']
        });
        res.gear.push({
          name: 'Jazz',
          quantity: 2,
          gear_description: '+1 REA, +2D6 initiative'
        });
        res.commlink = 3;

        if (rating < 2) {
          res.armor = 'Gilet pare-balles';
        }
        else if (rating < 5) {
          res.weapons.push('Ares Predator VI');
          res.armor = 'Veste pare-balles';
        }
        else {
          res.weapons.push('Ares Predator VI');
          res.armor = 'Armure corporelle int??grale';
        }
        break;

      case 'mob':
        res.attributes.agility = 1;
        res.attributes.reaction = 1;
        res.attributes.strength = 1;
        res.skills['Armes ?? feu'] = 1 + rating;
        res.skills.Influence = 2 + rating;
        res.skills.Perception = Math.floor(rating / 2);
        res.skills['Combat rapproch??'] = 2 + rating;
        res.qualities.positive.push('Dur ?? cuire');
        res.armor = 'Manteau renforc??';
        res.weapons.push('Couteau');
        res.commlink = 3;

        if (rating > 4) {
          res.weapons.push('AK-97');
          res.armor = 'Veste pare-balles';
        }
        else if (roll.dval(3) !== 3) {
          if (roll.dval(2) === 2)
            res.weapons.push('Ceska Black Scorpion');
          else
            res.weapons.push('Steyr TMP');
            res.armor = 'Veste pare-balles';
        }
        else if (roll.dval(2) === 2) {
          res.weapons.push('Colt Cobra TZ-120');
        }
        else {
          res.weapons.push('Ares Predator VI');
        }

        if (roll.dval(3) === 3) {
          res.skills.Athl??tisme = 1 + rating;
          res.gear.push({
            name: 'Grenade incapacitante',
            quantity: 2
          });
        }

        if (rating > 3 && roll.dval(3) === 3) {
          res.augmentations.push({
            name: 'Renforcement musculaire',
            rating: Math.ceil(rating / 3)
          });
        }

        if (rating > 3 && roll.dval(3) === 1) {
          res.augmentations.push({
            name: 'Tonification musculaire',
            rating: Math.ceil(rating / 3)
          });
        }




        break;

      case 'htr':
        res.attributes.body = 2;
        res.attributes.agility = 1;
        res.attributes.reaction = 1;
        res.attributes.logic = 1;
        res.skills['Combat rapproch??'] = 2 + rating;
        res.skills.Athl??tisme = 1 + rating;
        res.skills.Influence = 3 + Math.ceil(rating / 2);
        res.skills['Armes ?? feu'] = rating * 2 - 1;
        res.skills.Perception = 3 + Math.ceil(rating / 2);
        res.skills.Furtivit?? = 1 + rating;
        res.weapons.push('Ares Predator VI');
        res.commlink = rating - 1;
        res.augmentations.push({
          name: 'Cyberyeux',
          rating: 2,
          augments: ['Compensation anti-flashs', 'Interface visuelle', 'Smartlink', 'Vision thermographique', 'Vision nocturne']
        });

        switch (rating) {
          case 0:
          case 1:
            res.armor = 'Manteau renforc??';
            res.weapons.push('Mossberg CMDT');
            break;

          case 2:
          case 3:
            res.armor = 'Armure corporelle int??grale';
            res.weapons.push('FN P93 Praetor');
            res.gear.push({
              name: 'Grenade incapacitante',
              quantity: 2
            });
            break;

          default:
            res.armor = 'Armure corporelle int??grale avec casque et isolation chimique';
            res.weapons.push('Ares Alpha');
            res.gear.push({
              name: 'Grenade au gaz (CS/Lacrymo)',
              quantity: 2
            });
            res.gear.push({
              name: 'Grenade ?? fragmentation',
              quantity: 2
            });
            break;
        }

        if (rating > 2) {
          res.augmentations.push({
            name: 'Renforcement musculaire',
            rating: Math.ceil(rating / 3)
          });
          res.augmentations.push({
            name: 'Tonification musculaire',
            rating: Math.ceil(rating / 3)
          });
          res.augmentations.push({
            name: 'R??flexes c??bl??s',
            rating: Math.ceil(rating / 3)
          });
        }
        break;

      case 'specops':
        res.attributes.body = 1;
        res.attributes.agility = 2;
        res.attributes.strength = 1;
        res.attributes.logic = 1;
        res.attributes.intuition = 1;
        res.attributes.charisma = 1;
        res.skills['Combat rapproch??'] = 2 + rating;
        res.skills.Athl??tisme = 1 + rating;
        res.skills.Furtivit?? = rating;
        res.skills['Armes ?? feu'] = rating + 3;
        res.skills.Perception = 1 + rating;
        res.gear.push({
          name: 'Pistolet grappin'
        });
        res.gear.push({
          name: 'Grenade fumig??ne',
          quantity: 2
        });
        res.commlink = rating - 1;

        switch (rating) {
          case 0:
          case 1:
            res.armor = 'Manteau renforc??';
            res.weapons.push('FN P93 Praetor');
            break;

          case 2:
          case 3:
            res.armor = 'Armure corporelle int??grale';
            res.weapons.push('HK-227');
            res.gear.push({
              name: 'Grenade incapacitante',
              quantity: 2
            });
            res.gear.push({
              name: 'Grenade fumig??ne thermique',
              quantity: 2
            });
            break;

          default:
            res.armor = 'Armure corporelle int??grale avec casque et isolation chimique';
            res.weapons.push({
              name: 'HK-227',
              ammo: 'APDS'
            });
            res.gear.push({
              name: 'Grenade au gaz (CS/Lacrymo)',
              quantity: 2
            });
            res.gear.push({
              name: 'Grenade ?? fragmentation',
              quantity: 2
            });
            break;
        }

        if (rating > 0) {
          res.augmentations.push({
            name: 'Renforcement musculaire',
            rating: Math.ceil(rating / 2)
          });
          res.augmentations.push({
            name: 'Tonification musculaire',
            rating: Math.ceil(rating / 2)
          });
          res.augmentations.push({
            name: 'Amplificateur synaptique',
            rating: Math.ceil(rating / 2)
          });
        }
        break;

      case 'cultist':
        res.attributes.body = -1;
        res.attributes.strength = -1;
        res.attributes.logic = 1;
        res.attributes.intuition = 1;
        res.attributes.will = 2;
        res.skills['Combat rapproch??'] = 1 + rating;
        res.skills.Athl??tisme = 1 + rating;
        res.skills.Perception = 1 + rating;
        res.skills.Influence = 2 + rating;
        res.weapons.push('Massue');
        res.weapons.push('Couteau');

        if (roll.dval(3) === 3) {
          res.skills['Armes ?? feu'] = 1 + rating;
          res.weapons.push('Defiance T-250');
        }
        else if (roll.dval(3) === 3) {
          res.skills['Armes ?? feu'] = 1 + rating;
          res.weapons.push('Steyr TMP');
        }

        if (rating > 1) {
          res.skills.Athl??tisme = 1 + rating;

          if (roll.dval(2) === 2) {
            res.gear.push({
              name: 'Grenade incapacitante',
              quantity: 2
            });
          }
          else {
            res.gear.push({
              name: 'Grenade ?? fragmentation',
              quantity: 2
            });
          }
        }
        break;

      case 'cast':
        // Special case for when the special adjustments matter more than the type adjustments
        res.attributes.charisma = 1;
        res.skills.Influence = 2 + rating;
        break;
    }

    return res;
  },

  // Adjustments if a standard LT, or mage, or decker, etc
  get_special_adjustments: function (special_type, options) {
    var rating = options.professional_rating;

    var res = {
      professional_description: '',
      attributes: { body: 0, agility: 0, reaction: 0, strength: 0, will: 0, logic: 0, intuition: 0, charisma: 0 },
      skills: {},
      knowledge_skills: {},
      qualities: {
        positive: [],
        negative: []
      },
      weapons: [],
      armor: '',
      augmentations: [],
      gear: [],
      special: {}
    };

    if (special_type === 'LT') {
      switch (options.professional_type) {
        case 'civilian':
          res.professional_description = 'Civil';
          res.attributes.will = 1;
          res.skills.Influence = 3;
          break;

        case 'thug':
          res.professional_description = 'Voyou';
          res.attributes.agility = 1;
          res.attributes.strength = 1;
          res.attributes.logic = 1;
          res.skills.Influence = 2;
          res.skills['Armes ?? feu'] = 3;
          res.skills['Combat rapproch??'] = 1;
          res.weapons.push('Colt America L36');
          break;

        case 'ganger':
          res.professional_description = 'Ganger';
          res.attributes.reaction = 1;
          res.attributes.will = 1;
          res.attributes.logic = 1;
          res.attributes.intuition = 1;
          res.attributes.charisma = 1;
          res.skills.Influence = 3 + rating;
          res.skills['Combat rapproch??'] = 3 + rating;
          res.augmentations.push({ name: 'Lames d\'avant-bras' });
          res.armor = 'Manteau renforc??';
          break;

        case 'corpsec':
          res.professional_description = 'Garde de s??curit?? corpo';
          res.attributes.agility = 1;
          res.attributes.logic = 1;
          res.attributes.intuition = 1;
          res.skills['Combat rapproch??'] = 1 + rating;
          res.skills.Perception = 2 + rating;
          res.skills.Influence = 1 + rating;
          res.skills.Furtivit?? = rating;
          res.gear.push({
            name: 'Lentilles',
            rating: 2,
            augments: ['Interface visuelle', 'Smartlink', 'Vision thermographique']
          });
          res.gear.push({
            name: 'Grenade fumig??ne',
            quantity: 2
          });
          break;

        case 'police':
          res.professional_description = 'Membre des forces de l\'ordre';
          res.attributes.agility = 1;
          res.attributes.logic = 1;
          res.attributes.intuition = 1;
          res.attributes.charisma = 1;
          res.skills['Armes ?? feu'] = 1 + rating;
          res.skills['Combat rapproch??'] = 3 + rating;
          res.skills.Perception = 2 + rating;
          res.skills.Furtivit?? = rating;
          res.skills.Influence = 1 + rating;
          res.augmentations.push({
            name: 'Cyberyeux',
            rating: 2,
            augments: ['Compensation anti-flashs', 'Interface visuelle', 'Smartlink', 'Vision thermographique', 'Vision nocturne']
          });
          break;

        case 'mob':
          res.professional_description = 'Membre du crime organis??';
          res.attributes.reaction = 1;
          res.attributes.will = 1;
          res.attributes.logic = 1;
          res.attributes.charisma = 1;
          res.skills.Influence = 3 + rating;
          res.skills['Combat rapproch??'] = 3 + rating;
          res.armor = 'Manteau renforc??';
          res.augmentations.push({ name: 'Lames d\'avant-bras' });
          res.gear.push({
            name: 'Jazz',
            quantity: 2,
            gear_description: '+1 REA, +2D6 initiative'
          });
          res.gear.push({
            name: 'Novacoke',
            quantity: 2,
            gear_description: '+1 REA, +1 CHA, +1 Perception, Endurance ?? la douleur'
          });
          break;

        case 'htr':
          res.professional_description = 'Membre d\'une force d\'intervention';
          res.attributes.agility = 1;
          res.attributes.reaction = 1;
          res.attributes.strength = 1;
          res.attributes.will = 1;
          res.skills['Armes ?? distance exotiques'] = 3 + rating;
          res.skills.Ing??nierie = rating;
          break;

        case 'specops':
          res.professional_description = 'Membre des forces d\'op??rations sp??ciales';
          res.attributes.reaction = 1;
          res.attributes.strength = 1;
          res.attributes.logic = 1;
          res.attributes.will = 1;
          res.qualities.positive.push('Dur ?? cuire');
          res.weapons.push('Mossberg CMDT');
          break;

        case 'cultist':
          res.professional_description = 'Clerg??';
          res.attributes.body = 2;
          res.attributes.intuition = 1;
          res.attributes.charisma = 2;
          res.skills['Armes ?? feu'] = rating;
          res.weapons.push('Steyr TMP');
          break;
      }
    }

    if (special_type === 'Adept') {
      // What kind of adept?
      var improved_skill = 'Armes ?? feu', bonus_weapon;

      switch (options.professional_type) {
        default:
        case 'civilian':
        case 'police':
          bonus_weapon = 'Remington Roomsweeper';
          break;

        case 'cultist':
        case 'ganger':
          bonus_weapon = 'Mossberg CMDT';
          break;

        case 'corpsec':
          bonus_weapon = 'FN HAR';
          break;

        case 'mob':
          bonus_weapon = 'AK-97';
          break;

        case 'htr':
          bonus_weapon = 'FN P93 Praetor';
          break;

        case 'specops':
          bonus_weapon = 'Cavalier Arms Crockett EBR';
      }

      // Attributes
      res.attributes.reaction = 1;
      res.attributes.strength = 1;

      // Skills
      res.skills.Astral = rating + 2;
      res.skills['Combat rapproch??'] = rating + 2;
      res.skills['Armes ?? feu'] = rating + 2;

      // Qualities
      res.qualities.positive.push('Adepte');

      // Weapon
      res.weapons.push(bonus_weapon);

      var weapon_name;
      switch (roll.dval(8)) {
        default:
        case 1:
        case 2:
          weapon_name = 'Katana';
          break;

        case 3:
          weapon_name = 'Ep??e';
          break;

        case 4:
        case 5:
          weapon_name = 'Couteau';
          break;

        case 6:
          weapon_name = 'Massue';
          break;

        case 7:
        case 8:
          weapon_name = 'Matraque t??l??scopique';
          break;
      }
      if (rating > 4) {
        var focus = this.get_weapon(weapon_name);
        focus.magic_focus = true;
        focus.weapon_focus = true;
        focus.force = rating - 4;

        res.weapons.push(focus);
      }
      else {
        res.weapons.push(weapon_name);
      }

      if (rating > 3) {
        res.gear.push({
          name: 'Focus Qi',
          magic_focus: true,
          force: (rating - 3) * 2, // 4:2, 5:4, 6:6, 7:8
          power: 'Force am??lior??e',
          type: 'Attribut am??lior??',
          attribute: 'strength',
          rating: rating - 3
        });
      }

      // Specials : Spells
      res.special.Magic = 2 + rating;

      if (res.special.Magic > 6) {
        res.special.Initiate = res.special.Magic - 6;
        res.special.Magic = 6;
      }

      res.special.powers = [];

      switch (rating) {
        default:
        case 0:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 1,
              power_description: '+1D initiative et +1 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              type: 'ability',
              rating: 1,
              ability: improved_skill
            }
          );
          break;

        case 1:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 1,
              power_description: '+1D initiative et +1 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              type: 'ability',
              rating: 1,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              type: 'attribute',
              rating: 1,
              attribute: 'Agilit??'
            }
          );
          res.attributes.agility = +2;
          break;

        case 2:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 1,
              power_description: '+1D initiative et +1 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              rating: 1,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 2,
              attribute: 'Agilit??'
            }
          );
          res.attributes.agility = +2;
          break;

        case 3:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 2,
              power_description: '+2D initiative et +2 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              rating: 1,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 2,
              attribute: 'Agilit??'
            }
          );
          res.attributes.agility = +2;
          break;

        case 4:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 2,
              power_description: '+2D initiative et +2 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              rating: 3,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 2,
              attribute: 'Agilit??'
            }
          );
          res.attributes.agility = +2;
          break;

        case 5:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 2,
              power_description: '+2D initiative et +2 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              rating: 3,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 3,
              attribute: 'Agilit??'
            }
          );
          res.attributes.agility = +3;
          break;

        case 6:
          res.special.powers.push(
            {
              name: 'R??flexes am??lior??s',
              rating: 3,
              power_description: '+2D initiative et +2 REA'
            },
            {
              name: 'Comp??tences am??lior??es',
              rating: 3,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 3,
              attribute: 'Agilit??'
            }
          );
          res.attributes.agility = +3;
          break;
      }
    }

    if (special_type === 'Mage') {
      // Attributes
      res.attributes.will = 1;
      res.attributes.logic = 1;

      // Skills
      res.skills.Astral = rating + 2;
      res.skills.Conjuration = rating + 1;
      res.skills.Sorcellerie = rating + 2;

      // Qualities
      res.qualities.positive.push('Magicien');
      if (rating > 3) {
        res.qualities.positive.push('Concentration accrue ' + (rating - 2));
      }

      // Gear
      res.gear.push({
        name: 'Psyche',
        quantity: 2,
        gear_description: '+1 INT, +1 LOG'
      });
      res.gear.push({
        name: 'R??actifs',
        quantity: 10
      });
      res.gear.push({
        name: 'Focus de lancement de sort (Combat)',
        magic_focus: true,
        rating: rating
      });

      if (rating > 3) {
        res.gear.push({
          name: 'Focus de pouvoir',
          magic_focus: true,
          rating: rating - 3
        });
      }

      // Specials : Spells
      res.special.Magic = (rating < 2) ? 2 : rating;
      res.special.spells = [];
      switch (rating) {
        default:
        case 0:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
          );
          break;

        case 1:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
            {
              name: 'Barri??re physique',
              type: 'P',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'M',
              drain: '6',
              description: 'Indice de Structure ??gal ?? (Magie + succ??s d???un test de Sorcellerie + Magie). Le sort de base g??n??re une barri??re de deux m??tres sur deux et de deux centim??tres d?????paisseur. Extension de zone peut permettre d???ajouter deux m??tres en longueur et en largeur (mais pas en ??paisseur) ?? chaque fois qu???on choisit cet effet.'
            },
          );
          break;

        case 2:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
            {
              name: 'D??tection de la vie',
              type: 'M',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '3',
              description: 'D??tecte les ??tres dot??s d???une conscience.'
            },
          );
          break;

        case 3:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
            {
              name: 'Soins',
              type: 'P',
              portee: 'C',
              dmg: 'E',
              duree: 'P',
              drain: '3',
              description: 'Test de Sorcellerie + Magie (5 - Essence), ce qui fournit donc un succ??s automatique si la cible a une Essence de 6. Il permet de r??cup??rer 1 case de dommages au choix ??tourdissants, physiques ou de surplus par succ??s net. Les blessures ne peuvent ??tre trait??es qu???une seule fois par un sort de Sant?? (y compris Soins purificateurs, Soins refroidissants et Soins r??chauffants).'
            },
          );
          break;

        case 4:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
            {
              name: 'Augmentation de r??flexes',
              type: 'M',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '5',
              description: 'Test de Sorcellerie + Magie (5 - Essence), ce qui fournit donc un succ??s automatique si la cible a une Essence de 6. Le mage peut choisir le nombre de succ??s nets qu???il utilise pour augmenter ?? la fois le rang de R??action et le nombre de d??s d???initiative de la cible au taux de 1 point d???augmentation et de 1 d?? d???initiative par succ??s net sans pouvoir d??passer 5 d??s d???initiative. Pour chaque succ??s net utilis?? apr??s le premier, le Drain du sort est augment?? de 1 point. Les effets de ce sort ne s???appliquent pas en RV.'
            },
            {
              name: 'Sens du combat',
              type: 'M',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '5',
              description: 'Les succ??s nets du test de Lancement de sorts s???ajoutent ?? aux r??serves de d??s de d??fense et pour les tests de surprise (voir p. 112) tant que le sort est maintenu.'
            },
          );
          break;

        case 5:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'inflige ?? une cible des dommages physiques'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
            {
              name: 'Clairvoyance',
              type: 'M',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '3',
              description: 'vision dans une zone'
            },
            {
              name: 'Invisibilit?? sup??rieure',
              type: 'P',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '4',
              description: 'Octroie l\'??tat Invisibilit?? sup??rieure (voir p. 57).'
            },
          );
          break;

        case 6:
          res.special.spells.push(
            {
              name: 'Eclair de force',
              type: 'combat direct P',
              portee: 'LdV',
              dmg: 'P',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Silence',
              type: 'M',
              portee: 'C',
              duree: 'M',
              drain: '3',
              description: 'Impose ?? la cible l?????tat Silencieux (voir p. 57) avec un indice ??gal aux succ??s nets obtenus au test de Sorcellerie + Magie. Cet indice agit comme un seuil pour toute tentative visant ?? entendre le personnage.'
            },
            {
              name: 'Sph??re ??tourdissante',
              type: 'combat direct M',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'I',
              drain: '4',
              description: 'Canalise le mana de mani??re ?? ??tourdir.'
            },
            {
              name: 'Armure',
              type: 'combat direct M',
              portee: 'C',
              duree: 'M',
              drain: '4',
              description: 'Effectuez un test de Sorcellerie + Magie et ajoutez les succ??s nets au Score D??fensif de la cible.'
            },
            {
              name: 'Agonie',
              type: 'P',
              portee: 'C',
              duree: 'M',
              drain: '4',
              description: 'Test de Sorcellerie + Magie et ajoutez les succ??s nets au Score D??fensif de la cible.'
            },
          );
          break;
      }
    }

    if (special_type === 'Decker') {
      // Attributes
      if (rating < 3) {
        res.attributes.body = -1;
        res.attributes.agility = -1;
        res.attributes.strength = -1;
        res.attributes.logic = 1;
        res.attributes.intuition = 1;
      }
      else if (rating < 5) {
        res.attributes.agility = -1;
        res.attributes.strength = -1;
        res.attributes.logic = 1;
        res.attributes.intuition = 1;
        res.attributes.will = 1;
      }
      else {
        res.attributes.logic = 2;
        res.attributes.intuition = 1;
        res.attributes.will = 1;
      }

      // Skills
      res.skills.Piratage = rating + 2;
      res.skills.Electronique = rating;

      if (['corpsec', 'mob'].includes(options.professional_type)) {
        res.skills.Influence = rating;
        res.skills.Piratage = rating + 1;
        res.skills.Electronique = rating + 1;
      }

      if (['htr', 'specops'].includes(options.professional_type)) {
        res.skills.Ing??nierie = rating;
        res.skills.Electronique = rating + 2;
      }

      // Augmentations & Drugs
      if (rating > 5) {
        res.augmentations.push({
          name: 'Cervelet amplifi??',
          rating: rating - 4
        });
      }

      if (rating >= 4) {
        res.augmentations.push({
          name: 'Amplificateur c??r??bral',
          rating: rating - 3
        });
        res.gear.push({
          name: 'Psyche',
          quantity: 2,
          gear_description: '+1 INT, +1 LOG'
        });
      }

      if (rating > 3) {
        res.augmentations.push({
          name: 'Cyberjack',
          rating: rating - 2,
          descr: '(Td/F : ' + rating+1 + ' ' + rating + ')'
        });
      }
      else if (rating > 1) {
        res.augmentations.push({
          name: 'Datajack'
        });
      }
      else {
        res.gear.push({
          name: 'Trodes'
        });
      }

      // Deck
      switch (rating) {
        case 6:
        case 5:
          res.gear.push({
            name: 'Shiawase Cyber-6',
            type: 'cyberdeck',
            rating: 5,
            programs: ['Armure (+2 au SD)', 'Biofeedback', 'D??cryptage (+2D pour D??crypter)', 'Chiffrement (+2D pour Chiffrer)', 'Fork (avoir 2 cibles)', 'Exploitation (+2 SO pour Piratage)', 'Verrouillage (verrouille la connexion si dommages matriciels)']
          });
          break;

        case 4:
        case 3:
          res.gear.push({
            name: 'Spinrad Falcon',
            type: 'cyberdeck',
            rating: 2,
            programs: ['Armure (+2 au SD)', 'D??cryptage (+2D pour D??crypter)', 'Chiffrement (+2D pour Chiffrer)', 'Fork (avoir 2 cibles)', 'Exploitation (+2 SO pour Piratage)']
          });
          break;

        default:
          res.gear.push({
            name: 'Erika MCD-6',
            type: 'cyberdeck',
            rating: 1,
            programs: ['Armure (+2 au SD)', 'Overclock (+2D pour une action dont d?? libre)', 'Fork (avoir 2 cibles)']
          });
      }
    }

    if (special_type === 'Johnson') {
      // Attributes
      res.attributes.charisma = 1 + roll.half(rating);
      res.attributes.intuition = Math.max(roll.half(rating, true) - 1, 1);
      res.attributes.logic = Math.max(roll.half(rating, true) - 1, 1);
      res.attributes.will = Math.max(roll.half(rating - 1) - 1, 0);

      // Armor
      if (rating < 4)
        res.armor = 'V??tements pare-balles';
      else
        res.armor = 'Costume Actioneer';

      // Skills
      res.skills.Electronique = rating + 1;
      res.skills.Escroquerie = rating + 1;
      res.skills.Influence = Math.max(2, rating * 2);
      res.skills.Perception = rating + 2;
    }

    if (special_type === 'Gunbunny') {
      // Attributes
      res.attributes.agility = 3;
      res.attributes.reaction = 1;
      res.attributes.intuition = 1;

      // Qualities
      res.qualities.positive.push('Ambidextre');
      res.qualities.negative.push('Style distinctif');

      // One random quality from positive and negative
      var pos_q = ['Esprit analytique', 'M. Tout le Monde', 'Premi??re impression', 'Indomptable', 'M??moire photographique'];
      var neg_q = ['Gremlins', 'Organisme sensible', 'Asocial', 'Illetr??'];
      var i = roll.dval(neg_q.length) - 1;
      res.qualities.negative.push(neg_q[i]);
      i = roll.dval(neg_q.length) - 1;
      res.qualities.positive.push(pos_q[i]);

      // Armor
      if (rating < 4)
        res.armor = 'Gilet pare-balles';
      else
        res.armor = 'Manteau renforc??';

      // Skills
      res.skills['Armes ?? feu'] = rating + 4;
      res.skills.Athl??tisme = rating + 2;
      res.skills.Perception = rating + 2;
      res.skills.Furtivit?? = rating + 2;

      // Weapons, Augmentations & Drugs
      res.gear.push(this.get_gear('Jazz'));

      if (rating > 0) {
        augment = this.get_augmentation('Tonification musculaire');
        augment.rating = roll.half(rating) + 1;
        res.augmentations.push(augment);
        augment = this.get_augmentation('Amplificateur synaptique');
        augment.rating = roll.half(rating);
        res.augmentations.push(augment);
      }

      switch (options.race) {
        case 'Humain':
          res.skills.Athl??tisme = rating + 3;
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Browning Ultra-Power'));
            res.weapons.push(this.get_weapon('Streetline Special'));
            res.gear.push(this.get_gear('Grenade fumig??ne'));
            res.gear.push(this.get_gear('Grenade incapacitante'));
          }
          else {
            res.weapons.push(this.get_weapon('Ares Predator VI'));
            res.weapons.push(this.get_weapon('Colt America L36'));
            res.gear.push(this.get_gear('Grenade fumig??ne thermique'));
            res.gear.push(this.get_gear('Grenade ?? fragmentation'));
          }
          break;

        case 'Elfe':
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Ares Predator VI'));
            res.weapons.push(this.get_weapon('Fichetti Security 600'));
          }
          else {
            res.weapons.push(this.get_weapon('Ares Predator VI'));
          }
          break;

        case 'Nain':
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Defiance T-250'));
            res.weapons.push(this.get_weapon('Browning Ultra-Power'));
          }
          else {
            res.weapons.push(this.get_weapon('Mossberg CMDT'));
            res.weapons.push(this.get_weapon('Ares Predator VI'));
          }

          break;

        case 'Ork':
          res.skills.Intimidation = rating + 3;
          res.weapons.push(this.get_weapon('Remington Roomsweeper'));
          res.gear.push(this.get_gear('Grenade fumig??ne thermique'));
          res.gear.push(this.get_gear('Grenade ?? fragmentation'));
          break;

        case 'Troll':
          res.skills['Armes ?? feu'] = rating + 4;
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Steyr TMP'));
            res.weapons.push(this.get_weapon('Fichetti Security 600'));
          }
          else {
            res.weapons.push(this.get_weapon('HK-227'));
            res.weapons.push(this.get_weapon('Mossberg CMDT'));
            res.gear.push(this.get_gear('Grenade fumig??ne thermique'));
            res.gear.push(this.get_gear('Grenade ?? fragmentation'));
          }
          break;
      }
    }

    if (special_type === 'Samurai') {
      // Attributes
      res.attributes.agility = 2;
      res.attributes.body = 1;
      res.attributes.reaction = 1;
      res.attributes.strength = 1;

      // Skills
      res.skills['Armes ?? feu'] = rating + 3;
      res.skills['Combat rapproch??'] = rating + 2;
      res.skills.Perception = rating + 2;
      res.skills.Athl??tisme = rating + 2;
      res.skills.Furtivit?? = rating + 2;

      switch (options.race) {
        case 'Humain':
          res.attributes.reaction = 2;
          res.skills['Combat rapproch??'] = rating + 1;
          break;

        case 'Elfe':
          res.attributes.reaction = 2;
          res.skills.Athl??tisme = rating + 1;
          res.skills.Influence = rating + 1;
          break;

        case 'Nain':
          res.skills.Biotech = rating + 3;
          res.skills.Athl??tisme = rating + 3;
          if (rating < 3) {
            res.gear.push(this.get_gear('Grenade fumig??ne'));
            res.gear.push(this.get_gear('Grenade incapacitante'));
          }
          else {
            res.gear.push(this.get_gear('Grenade fumig??ne thermique'));
            res.gear.push(this.get_gear('Grenade ?? fragmentation'));
          }
          break;

        case 'Ork':
          res.skills.Influence = rating + 2;
          res.skills['Armes exotiques'] = rating + 2;
          break;

        case 'Troll':
          res.skills.Influence = rating + 3;
          res.skills['Armes exotiques'] = rating + 3;
          break;
      }

      // Qualities
      // One random quality from positive and negative
      var pos_q = ['Ambidextre', 'M. Tout le Monde', 'Fou du volant', 'R??sistance ?? la magie', 'Rage de vivre I'];
      var neg_q = ['Malchance', 'Personne(s) ?? charge I', 'Insomniaque', 'Ecorch??', 'Asocial'];
      var i = roll.dval(neg_q.length) - 1;
      res.qualities.negative.push(neg_q[i]);
      i = roll.dval(neg_q.length) - 1;
      res.qualities.positive.push(pos_q[i]);

      // Armor
      if (rating < 5)
        res.armor = 'Manteau renforc??';
      else
        res.armor = 'Armure corporelle int??grale';

      // Weapons, Augmentations & Drugs
      if (rating < 3)
        res.weapons.push(this.get_weapon('Couteau'));

      var augment;

      if (rating < 2) {
        res.gear.push(this.get_gear('Binoculaires'));
      }
      else {
        augment = this.get_augmentation('Cyberyeux');
        augment.rating = 2;
        res.augmentations.push(augment);
      }

      switch (options.race) {
        case 'Humain':
          if (rating > 1) {
            augment = this.get_augmentation('Tonification musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Amplificateur synaptique');
            augment.rating = roll.half(rating - 1);
            res.augmentations.push(augment);
            res.augmentations.push(this.get_augmentation('Lames d\'avant-bras'));
          }
          if (rating > 0) {
            augment = this.get_augmentation('Cervelet amplifi??');
            augment.rating = Math.ceil(rating / 3);
            res.augmentations.push(augment);
          }
          switch (rating) {
            case 0:
            case 1:
              res.weapons.push(this.get_weapon('Steyr TMP'));
              break;
            case 2:
            case 3:
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              res.weapons.push(this.get_weapon('Colt America L36'));
              break;
            case 4:
            case 5:
            case 6:
              res.weapons.push(this.get_weapon('Ares Alpha'));
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              res.weapons.push(this.get_weapon('Ares Predator VI'));
              break;
          }
          break;

        case 'Elfe':
          if (rating > 1) {
            augment = this.get_augmentation('Tonification musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Amplificateur synaptique');
            augment.rating = roll.half(rating - 1);
            res.augmentations.push(augment);
            res.weapons.push(this.get_weapon('Katana'));
          }
          if (rating > 0) {
            augment = this.get_augmentation('Cervelet amplifi??');
            augment.rating = Math.ceil(rating / 3);
            res.augmentations.push(augment);
          }
          switch (rating) {
            case 0:
            case 1:
              res.weapons.push(this.get_weapon('Ceska Black Scorpion'));
              break;
            case 2:
            case 3:
              res.weapons.push(this.get_weapon('FN P93 Praetor'));
              res.weapons.push(this.get_weapon('Ceska Black Scorpion'));
              break;
            case 4:
            case 5:
            case 6:
              res.weapons.push(this.get_weapon('FN HAR'));
              res.weapons.push(this.get_weapon('FN P93 Praetor'));
              res.weapons.push(this.get_weapon('Ceska Black Scorpion'));
              break;
          }
          break;

        case 'Nain':
          if (rating > 1) {
            augment = this.get_augmentation('Tonification musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Amplificateur synaptique');
            augment.rating = roll.half(rating - 1);
            res.augmentations.push(augment);
            res.weapons.push(this.get_weapon('Couteau de survie'));
          }

          augment = this.get_augmentation('Orthoderme');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);
          augment = this.get_augmentation('Augmentation de densit?? osseuse');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);

          switch (rating) {
            case 0:
            case 1:
              res.weapons.push(this.get_weapon('Ceska Black Scorpion'));
              break;
            case 2:
            case 3:
              res.weapons.push(this.get_weapon('HK-227'));
              res.weapons.push(this.get_weapon('Remington Roomsweeper'));
              break;
            case 4:
            case 5:
            case 6:
              res.weapons.push(this.get_weapon('Ares Alpha'));
              res.weapons.push(this.get_weapon('HK-227'));
              res.weapons.push(this.get_weapon('Ceska Black Scorpion'));
              break;
          }
          break;

        case 'Ork':
          if (rating > 1) {
            augment = this.get_augmentation('Tonification musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Renforcement musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Amplificateur synaptique');
            augment.rating = roll.half(rating - 1);
            res.augmentations.push(augment);
            res.weapons.push(this.get_weapon('Ep??e'));
          }

          augment = this.get_augmentation('Orthoderme');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);
          augment = this.get_augmentation('Augmentation de densit?? osseuse');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);

          switch (rating) {
            case 0:
            case 1:
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              break;
            case 2:
            case 3:
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              res.weapons.push(this.get_weapon('Browning Ultra-Power'));
              break;
            case 4:
            case 5:
            case 6:
              res.weapons.push(this.get_weapon('AK-97'));
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              res.weapons.push(this.get_weapon('Steyr TMP'));
              break;
          }
          break;

        case 'Troll':
          if (rating > 1) {
            augment = this.get_augmentation('Tonification musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Renforcement musculaire');
            augment.rating = roll.half(rating);
            res.augmentations.push(augment);
            augment = this.get_augmentation('Amplificateur synaptique');
            augment.rating = roll.half(rating - 1);
            res.augmentations.push(augment);
            res.weapons.push(this.get_weapon('Hache de combat'));
          }

          augment = this.get_augmentation('Orthoderme');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);
          augment = this.get_augmentation('Augmentation de densit?? osseuse');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);

          switch (rating) {
            case 0:
            case 1:
              res.weapons.push(this.get_weapon('Steyr TMP'));
              break;
            case 2:
            case 3:
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              res.weapons.push(this.get_weapon('Steyr TMP'));
              break;
            case 4:
            case 5:
            case 6:
              res.weapons.push(this.get_weapon('Ingram Valiant'));
              res.weapons.push(this.get_weapon('Colt Cobra TZ-120'));
              res.weapons.push(this.get_weapon('Steyr TMP'));
              break;
          }
          break;
      }

      if (rating < 4)
        res.gear.push(this.get_gear('Jazz'));
      else
        res.gear.push(this.get_gear('Kamikaze'));
    }

    if (special_type === 'Tank') {
      // Attributes
      res.attributes.body = 2;
      res.attributes.strength = 2;

      // Skills
      res.skills['Combat rapproch??'] = rating + 2;
      res.skills['Armes ?? feu'] = rating + 2;

      if (rating > 3) {
        res.augmentations.push(this.get_augmentation('Lames d\'avant-bras'));
      }
      // Qualities
      res.qualities.negative.push('Mauvaise r??putation');
      res.qualities.positive.push('Tripes');

      // Weapon
      if (rating < 2)
        res.weapons.push(this.get_weapon('Massue'));
      else
        res.weapons.push(this.get_weapon('Electromatraque'));

      if (rating < 3) {
        res.weapons.push(this.get_weapon('Defiance T-250'));
        res.weapons.push(this.get_weapon('Browning Ultra-Power'));
      }
      else {
        res.weapons.push(this.get_weapon('Mossberg CMDT'));
        res.weapons.push(this.get_weapon('Remington Roomsweeper'));
      }

      // Armor
      if (rating < 4)
        res.armor = 'Manteau renforc??';
      else if (rating < 6)
        res.armor = 'Armure corporelle int??grale';
      else
        res.armor = 'Armure corporelle int??grale avec casque et isolation chimique';

      // Augmentations & Drugs
      var augment, armor;

      augment = res.augmentations.find(function (aug) {
        return aug.name === 'Cyberyeux';
      });

      if (!augment) {
        augment = this.get_augmentation('Cyberyeux');
        augment.rating = 2;
        res.augmentations.push(augment);
      }

      if (rating > 2) {
        augment = this.get_augmentation('Orthoderme');
        augment.rating = rating - 2;
        res.augmentations.push(augment);
      }

      if (rating > 4) {
        augment = this.get_augmentation('Ossature renforc??e');
        augment.rating = rating - 4;
        res.augmentations.push(augment);
      }

      if (rating > 0) {
        armor = (rating > 3) ? 3 : rating;
        augment = this.get_augmentation('Cyberbras (gauche)');
        augment.bonus_armor = armor;
        if (!augment.hasOwnProperty('augments'))
          augment.augments = [];
        augment.augments.push('Armure ' + armor);
        res.augmentations.push(augment);
      }

      if (rating > 3) {
        armor = rating - 3;
        augment = this.get_augmentation('Cyberbras (droit)');
        augment.bonus_armor = armor;
        if (!augment.hasOwnProperty('augments'))
          augment.augments = [];
        augment.augments.push('Armure ' + armor);
        res.augmentations.push(augment);
      }
    }

    if (special_type === 'Shaman') {
      // Attributes
      res.attributes.will = 1;
      res.attributes.charisma = 1;

      // Skills
      res.skills.Astral = rating + 2;
      res.skills.Conjuration = rating + 2;
      res.skills.Sorcellerie = rating + 2;

      // Qualities
      res.qualities.positive.push('Magicien (Chaman)');
      if (rating > 3) {
        res.qualities.positive.push('Concentration accrue ' + (rating - 2));
      }

      // Gear
      res.gear.push({
        name: 'Psyche',
        quantity: 2,
        gear_description: '+1 INT, +1 LOG'
      });
      res.gear.push({
        name: 'Novacoke',
        quantity: 2,
        gear_description: '+1 REA, +1 CHA, +1 Perception, Endurance ?? la douleur'
      });
      res.gear.push({
        name: 'Focus d\'invocation',
        magic_focus: true,
        rating: rating
      });

      if (rating > 3) {
        res.gear.push({
          name: 'Focus de pouvoir',
          magic_focus: true,
          rating: rating - 3
        });
      }

      // Specials : Spells
      res.special.Magic = (rating < 2) ? 2 : rating;
      res.special.spells = [];
      switch (rating) {
        default:
        case 0:
          res.special.spells.push(
            {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'I',
              drain: '6',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
          );
          break;

        case 1:
          res.special.spells.push(
             {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'I',
              drain: '6',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Invisibilit??',
              type: 'M',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '3',
              description: 'Octroie au personnage cibl?? l?????tat Invisible (p. 57) et l???indice devient le seuil qu???il faut atteindre pour tout test visant ?? voir ce personnage.'
            },
          );
          break;

        case 2:
          res.special.spells.push(
            {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'I',
              drain: '6',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'D??tection de la magie',
              type: 'M',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '4',
              description: 'Inclut des focus, des r??actifs, des sorts actifs, des runes, des pr??parations alchimiques, des esprits et des rituels actifs.'
            },
          );
          break;

        case 3:
          res.special.spells.push(
           {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'I',
              drain: '6',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Soins',
              type: 'P',
              portee: 'C',
              dmg: 'E',
              duree: 'P',
              drain: '3',
              description: 'Test de Sorcellerie + Magie (5 - Essence), ce qui fournit donc un succ??s automatique si la cible a une Essence de 6. Il permet de r??cup??rer 1 case de dommages au choix ??tourdissants, physiques ou de surplus par succ??s net. Les blessures ne peuvent ??tre trait??es qu???une seule fois par un sort de Sant?? (y compris Soins purificateurs, Soins refroidissants et Soins r??chauffants).'
            },
          );
          break;

        case 4:
          res.special.spells.push(
            {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'M',
              drain: '3',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'T??n??bres',
              type: 'P',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'M',
              drain: '5',
              description: 'Pour chaque succ??s net obtenu, vous pouvez augmenter (gr??ce ?? Lumi??re) ou baisser (gr??ce ?? T??n??bres) le niveau de luminosit?? de la zone autour de vous, ce qui peut vous aider ?? d??terminer si vous gagnez de l???Atout en fonction de l???environnement et de la visibilit?? (p. 115). '
            },
            {
              name: 'Modeler le m??tal',
              type: 'P',
              portee: 'LdV',
              dmg: 'E',
              duree: 'M',
              drain: '5',
              description: 'Test de Sorcellerie + Magie contre R??sistance d???objet ; la quantit?? de mat??riau que vous pouvez fa??onner est d??termin??e par les succ??s nets du test.'
            },
          );
          break;

        case 5:
          res.special.spells.push(
            {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques.'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'I',
              drain: '6',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Contr??les des pens??es',
              type: 'M',
              portee: 'LdV',
              dmg: 'E',
              duree: 'L',
              drain: '4',
              description: 'Test de Sorcellerie + Magie contre Volont?? + Logique.'
            },
            {
              name: 'Fantasme sup??rieur',
              type: 'P',
              portee: 'LdV(z)',
              dmg: 'E',
              duree: 'M',
              drain: '4',
              description: 'Test de Sorcellerie + Magie : les succ??s nets forment le seuil ?? atteindre pour tout test de Volont?? + Intuition visant ?? d??jouer cette illusion.'
            },
          );
          break;

        case 6:
          res.special.spells.push(
            {
              name: 'Eclair mana',
              type: 'combat direct M',
              portee: 'LdV',
              duree: 'I',
              drain: '4',
              description: 'Inflige ?? une cible des dommages physiques'
            },
            {
              name: 'Temp??te de glace',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              duree: 'I',
              drain: '6',
              description: 'Affecte les cibles avec un froid glacial en infligeant des dommages ??l??mentaires de Froid (p. 114) et imposent l?????tat Frigorifi?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Sph??re de foudre',
              type: 'combat indirect P',
              portee: 'LdV(z)',
              dmg: 'P',
              duree: 'I',
              drain: '6',
              description: 'Inflige des dommages ??l??mentaires d?????lectricit?? (p. 114), imposant l?????tat ??lectrocut?? (p. 56) pendant un nombre de rounds de combat ??gal aux succ??s nets du test de Lancement de sorts.'
            },
            {
              name: 'Sonde mentale',
              type: 'P',
              portee: 'C',
              dmg: 'E',
              duree: 'M',
              drain: '5',
              description: 'Test de Sorcellerie + Magie contre Volont?? + Logique ; les succ??s nets d??terminent les informations que l???on peut extraire de la t??te de la cible.'
            },
            {
              name: 'Confusion',
              type: 'M',
              portee: 'LdV',
              dmg: 'E',
              duree: 'M',
              drain: '3',
              description: 'Test de Sorcellerie + Magie contre Volont?? + Logique : la cible subit l?????tat Confus avec un indice ??gal aux succ??s nets du test. La cible subit un malus ?? sa r??serve de d??s ??gal ?? cet indice pour tous ses tests sauf ceux de r??sistance aux dommages.'
            },
          );
          break;
      }
    }

    return res;
  },

  get_metatype_adjustment: function (race) {
    var res = {
      attributes: { body: 0, agility: 0, reaction: 0, strength: 0, will: 0, logic: 0, intuition: 0, charisma: 0 },
      min_attributes: { body: 1, agility: 1, reaction: 1, strength: 1, will: 1, logic: 1, intuition: 1, charisma: 1 },
      max_attributes: { body: 6, agility: 6, reaction: 6, strength: 6, will: 6, logic: 6, intuition: 6, charisma: 6 },
      augmentations: []
    };

    switch (race) {
      case 'Humain':
        break;

      case 'Elfe':
        res.attributes.agility = 1;
        res.min_attributes.agility = 2;
        res.max_attributes.agility = 7;
        res.attributes.charisma = 2;
        res.min_attributes.charisma = 3;
        res.max_attributes.charisma = 8;
        break;

      case 'Nain':
        res.attributes.body = 2;
        res.min_attributes.body = 3;
        res.max_attributes.body = 8;
        res.attributes.reaction = -1;
        res.min_attributes.reaction = 1;
        res.max_attributes.reaction = 5;
        res.attributes.strength = 2;
        res.min_attributes.strength = 3;
        res.max_attributes.strength = 8;
        res.attributes.will = 1;
        res.min_attributes.will = 2;
        res.max_attributes.will = 7;
        break;

      case 'Ork':
        res.attributes.body = 3;
        res.min_attributes.body = 4;
        res.max_attributes.body = 9;
        res.attributes.strength = 2;
        res.min_attributes.strength = 3;
        res.max_attributes.strength = 8;
        res.attributes.logic = -1;
        res.min_attributes.logic = 1;
        res.max_attributes.logic = 5;
        res.attributes.charisma = -1;
        res.min_attributes.charisma = 1;
        res.max_attributes.charisma = 5;
        break;

      case 'Troll':
        res.attributes.body = 4;
        res.min_attributes.body = 5;
        res.max_attributes.body = 10;
        res.attributes.agility = -1;
        res.min_attributes.agility = 1;
        res.max_attributes.agility = 5;
        res.attributes.strength = 4;
        res.min_attributes.strength = 5;
        res.max_attributes.strength = 10;
        res.attributes.logic = -1;
        res.min_attributes.logic = 1;
        res.max_attributes.logic = 5;
        res.attributes.intuition = -1;
        res.min_attributes.intuition = 1;
        res.max_attributes.intuition = 5;
        res.attributes.charisma = -2;
        res.min_attributes.charisma = 1;
        res.max_attributes.charisma = 4;
        res.augmentations.push({ name: 'D??p??ts dermiques' });
        break;

      case 'Special':
        res.max_attributes.agility = 30;
        res.max_attributes.body = 30;
        res.max_attributes.reaction = 30;
        res.max_attributes.strength = 30;
        res.max_attributes.will = 30;
        res.max_attributes.logic = 30;
        res.max_attributes.intuition = 30;
        res.max_attributes.charisma = 30;
        break;

      default:
        console.log('ERROR: get_metatype_adjustment() with no known metatype');
        res = false;
        break;
    }

    return res;
  },

  get_armor_list: function () {
    return {
      'Veste en cuir synth??tique': 1,
      'Costume Actioneer': 2,
      'V??tements pare-balles': 2,
      'Manteau renforc??': 3,
      'Gilet pare-balles': 3,
      'Veste pare-balles': 4,
      'Combinaison cam??l??on': 2,
      'Armure corporelle int??grale': 5,
      'Armure corporelle int??grale avec casque et isolation chimique': 7,
      'Manteau renforc??': 3,
      'Combinaison Urban Explorer': 3
    };
  },

  get_quality_list: function () {
    return {
      positive: [
        'Ambidextre',
        'Esprit analytique',
        'Cam??l??on astral',
        'M. Tout le Monde',
        'Premi??re impression',
        'Fou du volant',
        'Tripes',
        'Apparence humaine',
        'Indomptable',
        'R??sistance ?? la magie',
        'M??moire photographique',
        'Dur ?? cuire',
        'Rage de vivre I'
      ],
      negative: [
        'Malchance',
        'Mauvaise r??putation',
        'Paralysie en combat',
        'Personne(s) ?? charge I',
        'Style distinctif',
        'Poseur elfe',
        'Gremlins',
        'Insomniaque',
        'Crise de confiance',
        'Poseur ork',
        'Ecorch??',
        'Organisme sensible',
        'Asocial',
        'Illetr??'
      ]
    };
  },

  get_skill_list: function () {
    return [
      'Astral',
      'Athl??tisme',
      'Biotech',
      'Combat rapproch??',
      'Escroquerie',
      'Conjuration',
      'Piratage',
      'Electronique',
      'Enchantement',
      'Ing??nierie',
      'Armes exotiques',
      'Armes ?? feu',
      'Influence',
      'Plein air',
      'Perception',
      'Pilotage',
      'Sorcellerie',
      'Furtivit??',
      'Technomancie'
    ];
  },

  _augmentation_list: [
    {
      name: 'Augmentation de densit?? osseuse',
      essence: 0.3,
      max_rating: 4
    },
    {
      name: 'Ossature renforc??e',
      essence: 0.5,
      max_rating: 3
    },
    {
      name: 'Cervelet amplifi??',
      essence: 0.2,
      max_rating: 2
    },
    {
      name: 'Amplificateur c??r??bral',
      essence: 0.2,
      max_rating: 3
    },
    {
      name: 'Cyberbras (gauche)',
      essence: 1,
      type: 'full cyberlimb',
      sub_type: 'arm'
    },
    {
      name: 'Cyberbras (droit)',
      essence: 1,
      type: 'full cyberlimb',
      sub_type: 'arm'
    },
    {
      name: 'Cyberyeux',
      essence: 0.1,
      max_rating: 4,
      augments: ['Compensation anti-flashs', 'Interface visuelle', 'Smartlink', 'Vision thermographique', 'Vision nocturne']
    },
    {
      name: 'Cyberjambe (gauche)',
      essence: 1,
      type: 'full cyberlimb',
      sub_type: 'leg'
    },
    {
      name: 'Cyberjambe (droite)',
      essence: 1,
      type: 'full cyberlimb',
      sub_type: 'leg'
    },
    {
      name: 'Cyberjack',
      essence: 1,
      max_rating: 4,
      descr: 1
    },
    {
      name: 'Datajack',
      essence: 0.1
    },
    {
      name: 'Armure dermique',
      essence: 0.5,
      max_rating: 6
    },
    {
      name: 'R??servoir d\'air interne',
      essence: 0.5
    },
    {
      name: 'Renforcement musculaire',
      essence: 0.2,
      max_rating: 4
    },
    {
      name: 'Tonification musculaire',
      essence: 0.2,
      max_rating: 4
    },
    {
      name: 'Orthoderme',
      essence: 0.25,
      max_rating: 4
    },
    {
      name: 'Lames d\'avant-bras',
      essence: 0.3
    },
    {
      name: 'Amplificateur synaptique',
      essence: 0.5,
      max_rating: 3
    },
    {
      name: 'R??flexes c??bl??s',
      max_rating: 3
    },
    {
      name: 'D??p??ts dermiques',
      essence: 0,
      selectable: false
    },
    {
      name: 'Jazz (Active)',
      essence: 0,
      selectable: false
    },
    {
      name: 'Jazz (Crash)',
      essence: 0,
      selectable: false
    },
    {
      name: 'Kamikaze (Active)',
      essence: 0,
      selectable: false
    },
    {
      name: 'Kamikaze (Crash)',
      essence: 0,
      selectable: false
    },
    {
      name: 'Novacoke (Active)',
      essence: 0,
      selectable: false
    },
    {
      name: 'Psyche (Active)',
      essence: 0,
      selectable: false
    }
  ],

  get_augmentation_list: function () {
    return this._augmentation_list.slice(0);
  },

  get_augmentation: function (name) {
    var augment = this._augmentation_list.find(function (aug) {
      return aug.name === name;
    });
    return $.extend({}, augment);
  },

  _weapon_list: [
    {
      name: 'Hache de combat',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      ar_strength: 9,
      dv: 5
    },

    {
      name: 'Couteau de survie',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/2/-/-/-',
      ar_strength: 6,
      dv: 3
    },

    {
      name: 'Couteau',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/1/-/-/-',
      dv: 2,
      ar_strength: 6
    },

    {
      name: 'Katana',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 4,
      ar_strength: 10
    },

    {
      name: 'Ep??e',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 3,
      ar_strength: 9
    },

    {
      name: 'Lames d\'avant-bras',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 3,
      ar_strength: 6
    },

    {
      name: 'Massue',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 3,
      ar_strength: 6,
      damage_type: 'E'
    },

    {
      name: 'Electromatraque',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 5,
      ar_strength: 6,
      damage_type: 'E(e)'
    },

    {
      name: 'B??ton',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 4,
      damage_attribute: 'strength',
      ar_strength: 8,
      damage_type: 'E'
    },

    {
      name: 'Matraque t??l??scopique',
      type: 'Melee',
      ability: 'Combat rapproch??',
      ar: '/-/-/-/-',
      dv: 2,
      ar_strength: 5,
      damage_type: 'E'
    },

    {
      name: 'Defiance EX Shocker',
      type: 'Taser',
      ability: 'Armes ?? feu',
      ar: '10/6*/-/-/-',
      dv: 6,
      damage_type: 'E(e)',
      ap: -5,
      modes: 'CC',
      ammo_count: 4,
      reload: 'm'
    },

    {
      name: 'Streetline Special',
      type: 'Pistolets de poches',
      ability: 'Armes ?? feu',
      ar: '8/8/-/-/-',
      dv: 2,
      modes: 'CC',
      ammo_count: 6,
      reload: 'c'
    },

    {
      name: 'Colt America L36',
      type: 'Pistolets l??gers',
      ability: 'Armes ?? feu',
      ar: '8/8/6/-/-',
      dv: 2,
      modes: 'SA',
      ammo_count: 11,
      reload: 'c'
    },

    {
      name: 'Fichetti Security 600',
      type: 'Pistolets l??gers',
      ability: 'Armes ?? feu',
      ar: '10/9/6/-/-',
      dv: 2,
      modes: 'SA',
      rc_modified: 1,
      ammo_count: 30,
      reload: 'c'
    },

    {
      name: 'Ares Predator VI',
      type: 'Pistolets lourds',
      ability: 'Armes ?? feu',
      ar: '10/10/8/-/-',
      dv: 3,
      modes: 'SA/TR',
      ammo_count: 15,
      reload: 'c'
    },

    {
      name: 'Browning Ultra-Power',
      type: 'Pistolets lourds',
      ability: 'Armes ?? feu',
      ar: '10/9/6/-/-',
      dv: 3,
      modes: 'SA',
      ammo_count: 10,
      reload: 'c'
    },

    {
      name: 'Remington Roomsweeper',
      type: 'Shotgun',
      ability: 'Armes ?? feu',
      ar: '9/8/4/-/-',
      dv: 5,
      modes: 'SA',
      ammo_count: 8,
      reload: 'm'
    },

    {
      name: 'Ceska Black Scorpion',
      type: 'Pistolets mitrailleurs',
      ability: 'Armes ?? feu',
      ar: '10/9/8/-/-',
      dv: 2,
      modes: 'SA/TR',
      rc_modified: 1,
      ammo_count: 35,
      reload: 'c'
    },

    {
      name: 'Steyr TMP',
      type: 'Pistolets mitrailleurs',
      ability: 'Armes ?? feu',
      ar: '8/8/6/-/-',
      dv: 2,
      modes: 'SA/TR/TA',
      ammo_count: 30,
      reload: 'c'
    },

    {
      name: 'Colt Cobra TZ-120',
      type: 'Mitraillettes',
      ability: 'Armes ?? feu',
      ar: '10/11/8/-/-',
      dv: 3,
      modes: 'SA/TR',
      rc: 2,
      rc_modified: 3,
      ammo_count: 32,
      reload: 'c'
    },

    {
      name: 'FN P93 Praetor',
      type: 'Mitraillettes',
      ability: 'Armes ?? feu',
      ar: '9/12/7/-/-',
      dv: 4,
      modes: 'SA/TR/TA',
      rc: 1,
      rc_modified: 2,
      ammo_count: 50,
      reload: 'c'
    },

    {
      name: 'HK-227',
      type: 'Mitraillettes',
      ability: 'Armes ?? feu',
      ar: '10/11/8/-/-',
      dv: 3,
      modes: 'SA/TR',
      rc_modified: 1,
      ammo_count: 28,
      reload: 'c'
    },

    {
      name: 'AK-97',
      type: 'Fusils d\'assaut',
      ability: 'Armes ?? feu',
      ar: '4/11/9/7/1',
      dv: 5,
      modes: 'SA/TR/TA',
      ammo_count: 38,
      reload: 'c'
    },

    {
      name: 'Ares Alpha',
      type: 'Fusils d\'assaut',
      ability: 'Armes ?? feu',
      ar: '4/10/9/7/2',
      dv: 4,
      modes: 'SA/TR/TA',
      rc: 2,
      ammo_count: 42,
      reload: 'c'
    },

    {
      name: 'FN HAR',
      type: 'Fusils d\'assaut',
      ability: 'Armes ?? feu',
      ar: '3/11/10/6/1',
      dv: 5,
      modes: 'SA/TR/TA',
      rc: 2,
      ammo_count: 35,
      reload: 'c'
    },

    {
      name: 'Cavalier Arms Crockett EBR',
      type: 'Fusils de pr??cision',
      ability: 'Armes ?? feu',
      ar: '3/8/11/8/8',
      dv: 5,
      modes: 'SA/TR',
      rc_modified: 1,
      ammo_count: 20,
      reload: 'c'
    },

    {
      name: 'Defiance T-250',
      type: 'Shotgun',
      ability: 'Armes ?? feu',
      ar: '7/10/6/-/-',
      dv: 4,
      modes: 'SS/SA',
      ammo_count: 5,
      reload: 'm'
    },

    {
      name: 'Mossberg CMDT',
      type: 'Shotgun',
      ability: 'Armes ?? feu',
      ar: '4/11/7/-/-',
      dv: 4,
      modes: 'SA/TR',
      ammo_count: 10,
      reload: 'c'
    },

    {
      name: 'Ingram Valiant',
      type: 'Mitrailleuses',
      ability: 'Armes exotiques',
      ar: '2/11/12/7/3',
      dv: 4,
      modes: 'SA/TR/TA',
      ammo_count: 50,
      reload: 'c'
    },

    {
      name: 'Panther XXL',
      type: 'Mitrailleuses',
      ability: 'Armes exotiques',
      ar: '1/9/12/8/6',
      dv: 7,
      modes: 'SA',
      ammo_count: 15,
      reload: 'c'
    }
  ],

  get_weapon_list: function () {
    var list = this._weapon_list.map(function (i) {
      return i.name;
    });

    list.sort();

    return list;
  },

  get_weapon: function (name) {
    var data = {
      name: name, // Display name of the weapon: Knife, Ares Predator V, etc.
      type: '', // Display type of the weapon: Light Pistol, SMG, etc.
      ability: '', // Linked ability: Close Combat, Firearms, etc.
      ar: '-/-/-/-/-', // Attack Rating value at each range category
      dv: '', // Damage Value
      damage_type: 'P', // Physical, Stun, Stun(electrical)
      damage_attribute: null, // If damage is linked to STR instead of bullet type
      ap: 0,
      modes: '',
      rc: 0, // Base recoil compensation
      rc_modified: 0, // Conditional recoil compensation
      ammo_count: 0,
      reload: 'c', // Clip, Internal Magazine, etc.
      ammo_type: '', // Assume normal ammo unless specified
    };

    var stock_weapon = this._weapon_list.find(function (i) {
      return name === i.name;
    });

    if (stock_weapon === undefined) {
      console.log('ERROR: get_weapon() with no known weapon name');
      return stock_weapon;
    }

    return $.extend(data, stock_weapon);
  },

  _gear_list: [
    {
      name: 'Lunettes',
      rating: 2,
      augments: ['Interface visuelle', 'Smartlink', 'Vision nocturne'],
      gear_description: '+1D pour la perception visuelle, +2D pour tirer si smartgun'
    },
    {
      name: 'Binoculaires',
      rating: 2,
      augments: ['Interface visuelle', 'Smartlink', 'Vision thermographique'],
      gear_description: '+1D pour la perception visuelle, +2D pour tirer si smartgun'
    },
    {
      name: 'Jazz',
      quantity: 2,
      gear_description: '+1 REA, +2D6 initiative'
    },
    {
      name: 'Kamikaze',
      quantity: 2,
      gear_description: '+1 CON, +1 AGI, +2 FOR, +1 VOL, +2D6 initiative, Endurance ?? la douleur (10*1D6mn)'
    },
    {
      name: 'Novacoke',
      quantity: 2,
      gear_description: '+1 REA, +1 CHA, +1 Perception, Endurance ?? la douleur'
    },
    {
      name: 'Psyche',
      quantity: 2,
      gear_description: '+1 INT, +1 LOG'
    },
    {
      name: 'R??actifs',
      quantity: 10
    },
    {
      name: 'Grenade incapacitante',
      quantity: 2
    },
    {
      name: 'Grenade ?? fragmentation',
      quantity: 1
    },
    {
      name: 'Grenade au gaz (CS/Lacrymo)',
      quantity: 2
    },
    {
      name: 'Grenade fumig??ne',
      quantity: 2
    },
    {
      name: 'Grenade fumig??ne thermique',
      quantity: 2
    },
    {
      name: 'Pistolet grappin'
    },
    {
      name: 'Scanner de fr??quence',
      rating: 2
    },
    {
      name: 'Lampe-torche',
      gear_description: 'c\'est une superbe lampe-torche.' 
    },
    {
      name: 'Stim Patch',
      rating: 3,
      quantity: 2
    },
    {
      name: 'Trodes'
    }
  ],

  get_gear_list: function () {
    return this._gear_list.slice(0);
  },

  get_gear: function (name) {
    var gear = this._gear_list.find(function (g) {
      return g.name === name;
    });
    return $.extend({}, gear);
  },

  get_skill_attributes: function (skill) {
    var data = {
      attribute: null
    };

    switch (skill) {
      // Agility based skills
      case 'Athl??tisme':
      case 'Combat rapproch??':
      case 'Armes exotiques':
      case 'Armes exotiques':
      case 'Armes ?? feu':
      case 'Furtivit??':
        data.attribute = 'agility';
        break;

      // Reaction based skills
      case 'Pilotage':
        data.attribute = 'reaction';
        break;

      // Charisma based social skills
      case 'Escroquerie':
      case 'Influence':
        data.attribute = 'charisma';
        break;

      // Logic based skills
      case 'Biotech':
      case 'Piratage':
      case 'Electronique':
      case 'Ing??nierie':
        data.attribute = 'logic';
        break;

      // Intuition based mental skills
      case 'Plein air':
      case 'Perception':
        data.attribute = 'intuition';
        break;

      // Willpower based skills
      case 'Astral':
        data.attribute = 'will';
        break;

      // Magic based skills
      case 'Conjuration':
      case 'Enchantement':
      case 'Sorcellerie':
        data.attribute = 'magic';
        break;

      default:
        console.log('ERROR: get_skill_attributes() with unknown skill', skill);
    }

    return data;
  }
};
