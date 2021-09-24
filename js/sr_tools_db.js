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

        if (roll.dval(6) === 6) {
          res.skills['Armes à feu'] = 1 + rating;
          res.armor = 'Vêtements blindés';
          res.weapons.push('Defiance EX Shocker');
        }
        break;

      case 'thug':
        res.attributes.reaction = 1;
        res.attributes.strength = 1;
        res.skills.Influence = 2 + rating;
        res.skills['Combat rapproché'] = 2 + rating;
        res.weapons.push('Armes contondantes');
        res.weapons.push('Couteau');

        if (rating > 4 || roll.dval(3) === 3) {
          res.skills['Armes à feu'] = 1 + rating;
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
        res.skills['Armes à feu'] = 3 + rating;
        res.skills['Combat rapproché'] = 2 + rating;
        res.qualities.positive.push('Dur à cuire');
        res.armor = 'Gilet pare-balles';
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
          res.skills.Athlétisme = 1 + rating;
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
        res.skills['Armes à feu'] = 2 + rating;
        res.skills.Athlétisme = 3 + Math.floor(rating / 2);
        res.skills['Combat rapproché'] = 1 + rating;
        res.commlink = 3;

        if (rating < 2) {
          res.weapons.push('Fichetti Security 600');
          res.weapons.push('Baton étourdissant');
          res.armor = 'Gilet pare-balles';
        }
        else if (rating < 5) {
          res.weapons.push('Colt Cobra TZ-120');
          res.weapons.push('Fichetti Security 600');
          res.weapons.push('Baton étourdissant');
          res.armor = 'Veste pare-balles';
        }
        else {
          res.skills.Athlétisme = 1 + rating;
          res.weapons.push('FN P93 Praetor');
          res.weapons.push('Ares Predator VI');
          res.weapons.push('Baton étourdissant');
          res.armor = 'Armure complète';
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
        res.skills['Armes à feu'] = 3 + Math.floor(rating / 2);
        res.skills.Athlétisme = 1 + Math.floor(rating / 2);
        res.skills['Combat rapproché'] = 1 + rating;
        res.armor = 'Manteau renforcé';
        res.weapons.push('Defiance EX Shocker');
        res.weapons.push('Baton étourdissant');
        res.gear.push({
          name: 'Lunettes',
          rating: 2,
          augments: ['Interface visuelle', 'Smartlink', 'Vision nocturne']
        });
        res.gear.push({
          name: 'Jazz',
          quantity: 2
        });
        res.commlink = 3;

        if (rating < 2) {
          res.armor = 'Veste pare-balles';
        }
        else {
          res.weapons.push('Ares Predator VI');
        }
        break;

      case 'mob':
        res.attributes.agility = 1;
        res.attributes.reaction = 1;
        res.attributes.strength = 1;
        res.skills['Armes à feu'] = 1 + rating;
        res.skills.Influence = 2 + rating;
        res.skills.Perception = Math.floor(rating / 2);
        res.skills['Combat rapproché'] = 2 + rating;
        res.qualities.positive.push('Dur à cuire');
        res.armor = 'Manteau renforcé';
        res.weapons.push('Couteau');
        res.commlink = 3;

        if (rating > 4) {
          res.weapons.push('AK-97');
        }
        else if (roll.dval(3) !== 3) {
          if (roll.dval(2) === 2)
            res.weapons.push('Ceska Black Scorpion');
          else
            res.weapons.push('Steyr TMP');
        }
        else if (roll.dval(2) === 2) {
          res.weapons.push('Colt Cobra TZ-120');
        }
        else {
          res.weapons.push('Ares Predator VI');
        }

        if (roll.dval(3) === 3) {
          res.skills.Athlétisme = 1 + rating;
          res.gear.push({
            name: 'Grenade incapacitante',
            quantity: 2
          });
        }

        if (rating > 4) {
          res.weapons.push('AK-97');
        }
        break;

      case 'htr':
        res.attributes.body = 2;
        res.attributes.agility = 1;
        res.attributes.reaction = 1;
        res.attributes.logic = 1;
        res.skills['Combat rapproché'] = 2 + rating;
        res.skills.Athlétisme = 1 + rating;
        res.skills.Influence = 3 + Math.ceil(rating / 2);
        res.skills['Armes à feu'] = rating * 2 - 1;
        res.skills.Perception = 3 + Math.ceil(rating / 2);
        res.skills.Furtivité = 1 + rating;
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
            res.armor = 'Manteau renforcé';
            res.weapons.push('Mossberg CMDT');
            break;

          case 2:
          case 3:
            res.armor = 'Armure corporelle intégrale';
            res.weapons.push('FN P93 Praetor');
            res.gear.push({
              name: 'Grenade incapacitante',
              quantity: 2
            });
            break;

          default:
            res.armor = 'Armure corporelle intégrale avec casque et isolation chimique';
            res.weapons.push('Ares Alpha');
            res.gear.push({
              name: 'Grenade au gaz (CS/Lacrymo)',
              quantity: 2
            });
            res.gear.push({
              name: 'Grenade à fragmentation',
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
            name: 'Réflexes cablés',
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
        res.skills['Combat rapproché'] = 2 + rating;
        res.skills.Athlétisme = 1 + rating;
        res.skills.Furtivité = rating;
        res.skills['Armes à feu'] = rating + 3;
        res.skills.Perception = 1 + rating;
        res.gear.push({
          name: 'Pistolet grappin'
        });
        res.gear.push({
          name: 'Grenade fumigène',
          quantity: 2
        });
        res.commlink = rating - 1;

        switch (rating) {
          case 0:
          case 1:
            res.armor = 'Manteau renforcé';
            res.weapons.push('FN P93 Praetor');
            break;

          case 2:
          case 3:
            res.armor = 'Armure corporelle intégrale';
            res.weapons.push('HK-227');
            res.gear.push({
              name: 'Grenade incapacitante',
              quantity: 2
            });
            res.gear.push({
              name: 'Grenade fumigène thermique',
              quantity: 2
            });
            break;

          default:
            res.armor = 'Armure corporelle intégrale avec casque et isolation chimique';
            res.weapons.push({
              name: 'HK-227',
              ammo: 'APDS'
            });
            res.gear.push({
              name: 'Grenade au gaz (CS/Lacrymo)',
              quantity: 2
            });
            res.gear.push({
              name: 'Grenade à fragmentation',
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
        res.skills['Combat rapproché'] = 1 + rating;
        res.skills.Athlétisme = 1 + rating;
        res.skills.Perception = 1 + rating;
        res.skills.Influence = 2 + rating;
        res.weapons.push('Armes contondantes');
        res.weapons.push('Couteau');

        if (roll.dval(3) === 3) {
          res.skills['Armes à feu'] = 1 + rating;
          res.weapons.push('Defiance T-250');
        }
        else if (roll.dval(3) === 3) {
          res.skills['Armes à feu'] = 1 + rating;
          res.weapons.push('Steyr TMP');
        }

        if (rating > 1) {
          res.skills.Athlétisme = 1 + rating;

          if (roll.dval(2) === 2) {
            res.gear.push({
              name: 'Grenade incapacitante',
              quantity: 2
            });
          }
          else {
            res.gear.push({
              name: 'Grenade à fragmentation',
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
          res.skills['Armes à feu'] = 3;
          res.skills['Combat rapproché'] = 1;
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
          res.skills['Combat rapproché'] = 3 + rating;
          res.augmentations.push({ name: 'Lames d\'avant-bras' });
          res.armor = 'Manteau renforcé';
          break;

        case 'corpsec':
          res.professional_description = 'Garde de sécurité corpo';
          res.attributes.agility = 1;
          res.attributes.logic = 1;
          res.attributes.intuition = 1;
          res.skills['Combat rapproché'] = 1 + rating;
          res.skills.Perception = 2 + rating;
          res.skills.Influence = 1 + rating;
          res.skills.Furtivité = rating;
          res.gear.push({
            name: 'Lentilles',
            rating: 2,
            augments: ['Interface visuelle', 'Smartlink', 'Vision thermographique']
          });
          res.gear.push({
            name: 'Grenade fumigène',
            quantity: 2
          });
          break;

        case 'police':
          res.professional_description = 'Membre des forces de l\'ordre';
          res.attributes.agility = 1;
          res.attributes.logic = 1;
          res.attributes.intuition = 1;
          res.attributes.charisma = 1;
          res.skills['Armes à feu'] = 1 + rating;
          res.skills['Combat rapproché'] = 3 + rating;
          res.skills.Perception = 2 + rating;
          res.skills.Furtivité = rating;
          res.skills.Influence = 1 + rating;
          res.augmentations.push({
            name: 'Cyberyeux',
            rating: 2,
            augments: ['Compensation anti-flashs', 'Interface visuelle', 'Smartlink', 'Vision thermographique', 'Vision nocturne']
          });
          break;

        case 'mob':
          res.professional_description = 'Membre du crime organisé';
          res.attributes.reaction = 1;
          res.attributes.will = 1;
          res.attributes.logic = 1;
          res.attributes.charisma = 1;
          res.skills.Influence = 3 + rating;
          res.skills['Combat rapproché'] = 3 + rating;
          res.armor = 'Manteau renforcé';
          res.augmentations.push({ name: 'Lames d\'avant-bras' });
          res.gear.push({
            name: 'Jazz',
            quantity: 2
          });
          res.gear.push({
            name: 'Novacoke',
            quantity: 2
          });
          break;

        case 'htr':
          res.professional_description = 'Membre d\'une force d\'intervention';
          res.attributes.agility = 1;
          res.attributes.reaction = 1;
          res.attributes.strength = 1;
          res.attributes.will = 1;
          res.skills['Armes à distance exotiques'] = 3 + rating;
          res.skills.Ingénierie = rating;
          break;

        case 'specops':
          res.professional_description = 'Membre des forces d\'opérations spéciales';
          res.attributes.reaction = 1;
          res.attributes.strength = 1;
          res.attributes.logic = 1;
          res.attributes.will = 1;
          res.qualities.positive.push('Dur à cuire');
          res.weapons.push('Mossberg CMDT');
          break;

        case 'cultist':
          res.professional_description = 'Clergé';
          res.attributes.body = 2;
          res.attributes.intuition = 1;
          res.attributes.charisma = 2;
          res.skills['Armes à feu'] = rating;
          res.weapons.push('Steyr TMP');
          break;
      }
    }

    if (special_type === 'Adept') {
      // What kind of adept?
      var improved_skill = 'Armes à feu', bonus_weapon;

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
      res.skills['Combat rapproché'] = rating + 2;
      res.skills['Armes à feu'] = rating + 2;

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
          weapon_name = 'Epée';
          break;

        case 4:
        case 5:
          weapon_name = 'Couteau';
          break;

        case 6:
          weapon_name = 'Matraque';
          break;

        case 7:
        case 8:
          weapon_name = 'Matraque téléscopique';
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
          power: 'Force améliorée',
          type: 'Attribut amélioré',
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
              name: 'Réflexes améliorés',
              rating: 1
            },
            {
              name: 'Compétences améliorées',
              type: 'ability',
              rating: 1,
              ability: improved_skill
            }
          );
          break;

        case 1:
          res.special.powers.push(
            {
              name: 'Réflexes améliorés',
              rating: 1
            },
            {
              name: 'Compétences améliorées',
              type: 'ability',
              rating: 1,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              type: 'attribute',
              rating: 1,
              attribute: 'Agilité'
            }
          );
          res.attributes.agility = +2;
          break;

        case 2:
          res.special.powers.push(
            {
              name: 'Réflexes améliorés',
              rating: 1
            },
            {
              name: 'Compétences améliorées',
              rating: 1,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 2,
              attribute: 'Agilité'
            }
          );
          res.attributes.agility = +2;
          break;

        case 3:
          res.special.powers.push(
            {
              name: 'Réflexes améliorés',
              rating: 2
            },
            {
              name: 'Compétences améliorées',
              rating: 1,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 2,
              attribute: 'Agilité'
            }
          );
          res.attributes.agility = +2;
          break;

        case 4:
          res.special.powers.push(
            {
              name: 'Réflexes améliorés',
              rating: 2
            },
            {
              name: 'Compétences améliorées',
              rating: 3,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 2,
              attribute: 'Agilité'
            }
          );
          res.attributes.agility = +2;
          break;

        case 5:
          res.special.powers.push(
            {
              name: 'Réflexes améliorés',
              rating: 2
            },
            {
              name: 'Compétences améliorées',
              rating: 3,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 3,
              attribute: 'Agilité'
            }
          );
          res.attributes.agility = +3;
          break;

        case 6:
          res.special.powers.push(
            {
              name: 'Réflexes améliorés',
              rating: 3
            },
            {
              name: 'Compétences améliorées',
              rating: 3,
              ability: improved_skill
            },
            {
              name: 'Improved Physical Attribute',
              rating: 3,
              attribute: 'Agilité'
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
        quantity: 2
      });
      res.gear.push({
        name: 'Réactifs',
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
      res.special.spells = ['Eclair de force', 'Silence', 'Sphère étourdissante'];
      switch (rating) {
        case 6:
          res.special.spells.push('Armure', 'Agonie');
        case 5:
          res.special.spells.push('Clairvoyance', 'Invisibilité supérieure');
        case 4:
          res.special.spells.push('Augmentation de réflexes', 'Sens du combat');
        case 3:
          res.special.spells.push('Soins');
        case 2:
          res.special.spells.push('Détection de la vie');
        case 1:
          res.special.spells.push('Barrière physique');
        default:
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

      if (['corpsec', 'htr', 'mob', 'specops'].includes(options.professional_type)) {
        res.skills.Influence = rating;
        res.skills.Piratage = rating + 1;
        res.skills.Electronics = rating + 1;
      }

      if (['htr', 'specops'].includes(options.professional_type)) {
        res.skills.Ingénierie = rating;
      }

      // Augmentations & Drugs
      if (rating > 5) {
        res.augmentations.push({
          name: 'Cervelet amplifié',
          rating: rating - 4
        });
      }

      if (rating >= 4) {
        res.augmentations.push({
          name: 'Amplificateur cérébral',
          rating: rating - 3
        });
        res.gear.push({
          name: 'Psyche',
          quantity: 2
        });
      }

      if (rating > 1) {
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
            name: 'Shiawase Cyber-5',
            type: 'cyberdeck',
            rating: 5,
            programs: ['Armure', 'Biofeedback', 'Décryptage', 'Chiffrement', 'Fork', 'Hammer', 'Verrouillage']
          });
          break;

        case 4:
        case 3:
          res.gear.push({
            name: 'Hermes Chariot',
            type: 'cyberdeck',
            rating: 2,
            programs: ['Armure', 'Décryptage', 'Chiffrement', 'Fork', 'Hammer']
          });
          break;

        default:
          res.gear.push({
            name: 'Erika MCD-1',
            type: 'cyberdeck',
            rating: 1,
            programs: ['Armure', 'Baby Monitor', 'Fork']
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
        res.armor = 'Vêtements pare-balles';
      else
        res.armor = 'Costume Actioneer';

      // Skills
      res.skills.Electronics = rating + 1;
      res.skills.Con = rating + 1;
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
      var pos_q = ['Esprit analytique', 'M. Tout le Monde', 'Première impression', 'Indomptable', 'Mémoire photographique'];
      var neg_q = ['Gremlins', 'Organisme sensible', 'Asocial', 'Illetré'];
      var i = roll.dval(neg_q.length) - 1;
      res.qualities.negative.push(neg_q[i]);
      i = roll.dval(neg_q.length) - 1;
      res.qualities.positive.push(pos_q[i]);

      // Armor
      if (rating < 4)
        res.armor = 'Veste pare-balles';
      else
        res.armor = 'Manteau renforcé';

      // Skills
      res.skills['Armes à feu'] = rating + 4;
      res.skills.Athlétisme = rating + 2;
      res.skills.Perception = rating + 2;
      res.skills.Furtivité = rating + 2;

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
          res.skills.Athlétisme = rating + 3;
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Browning Ultra-Power'));
            res.weapons.push(this.get_weapon('Streetline Special'));
            res.gear.push(this.get_gear('Grenade fumigène'));
            res.gear.push(this.get_gear('Grenade incapacitante'));
          }
          else {
            res.weapons.push(this.get_weapon('Ares Predator VI'));
            res.weapons.push(this.get_weapon('Colt America L36'));
            res.gear.push(this.get_gear('Grenade fumigène thermique'));
            res.gear.push(this.get_gear('Grenade à fragmentation'));
          }
          break;

        case 'Elfe':
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Ares Predator VI'));
            res.weapons.push(this.get_weapon('Fichetti Security 600'));
          }
          else {
            res.weapons.push(this.get_weapon('Ares Predator VI'));
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
          res.weapons.push(this.get_weapon('Remington Roomsweeper'));
          break;

        case 'Troll':
          res.skills['Armes à feu'] = rating + 4;
          if (rating < 2) {
            res.weapons.push(this.get_weapon('Steyr TMP'));
            res.weapons.push(this.get_weapon('Steyr TMP'));
          }
          else {
            res.weapons.push(this.get_weapon('HK-227'));
            res.weapons.push(this.get_weapon('HK-227'));
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
      res.skills['Armes à feu'] = rating + 3;
      res.skills['Combat rapproché'] = rating + 2;
      res.skills.Perception = rating + 2;
      res.skills.Athlétisme = rating + 2;
      res.skills.Furtivité = rating + 2;

      switch (options.race) {
        case 'Humain':
          res.attributes.reaction = 2;
          res.skills['Combat rapproché'] = rating + 1;
          break;

        case 'Elfe':
          res.attributes.reaction = 2;
          res.skills.Athlétisme = rating + 1;
          res.skills.Influence = rating + 1;
          break;

        case 'Nain':
          res.skills.Biotech = rating + 3;
          res.skills.Athlétisme = rating + 3;
          if (rating < 3) {
            res.gear.push(this.get_gear('Grenade fumigène'));
            res.gear.push(this.get_gear('Grenade incapacitante'));
          }
          else {
            res.gear.push(this.get_gear('Grenade fumigène thermique'));
            res.gear.push(this.get_gear('Grenade à fragmentation'));
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
      var pos_q = ['Ambidextre', 'M. Tout le Monde', 'Fou du volant', 'Résistance à la magie', 'Rage de vivre I'];
      var neg_q = ['Malchance', 'Personne(s) à charge I', 'Insomniaque', 'Ecorché', 'Asocial'];
      var i = roll.dval(neg_q.length) - 1;
      res.qualities.negative.push(neg_q[i]);
      i = roll.dval(neg_q.length) - 1;
      res.qualities.positive.push(pos_q[i]);

      // Armor
      if (rating < 5)
        res.armor = 'Manteau renforcé';
      else
        res.armor = 'Armure corporelle intégrale';

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
            augment = this.get_augmentation('Cervelet amplifié');
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
            augment = this.get_augmentation('Cervelet amplifié');
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
            res.weapons.push(this.get_weapon('Couteau de combat'));
          }

          augment = this.get_augmentation('Orthoderme');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);
          augment = this.get_augmentation('Augmentation de densité osseuse');
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
            res.weapons.push(this.get_weapon('Epée'));
          }

          augment = this.get_augmentation('Orthoderme');
          augment.rating = roll.half(rating + 2);
          res.augmentations.push(augment);
          augment = this.get_augmentation('Augmentation de densité osseuse');
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
          augment = this.get_augmentation('Augmentation de densité osseuse');
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
      res.skills['Combat rapproché'] = rating + 2;
      res.skills['Armes à feu'] = rating + 2;

      if (rating > 3) {
        res.augmentations.push(this.get_augmentation('Lames d\'avant-bras'));
      }
      // Qualities
      res.qualities.negative.push('Mauvaise réputation');
      res.qualities.positive.push('Tripes');

      // Weapon
      if (rating < 2)
        res.weapons.push(this.get_weapon('Armes contondantes'));
      else
        res.weapons.push(this.get_weapon('Baton étourdissant'));

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
        res.armor = 'Manteau renforcé';
      else if (rating < 6)
        res.armor = 'Armure corporelle intégrale';
      else
        res.armor = 'Armure corporelle intégrale avec casque et isolation chimique';

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
        augment = this.get_augmentation('Ossature renforcée');
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
      reres.skills.Sorcellerie = rating + 2;

      // Qualities
      res.qualities.positive.push('Magicien (Shaman)');
      if (rating > 3) {
        res.qualities.positive.push('Concentration accrue ' + (rating - 2));
      }

      // Gear
      res.gear.push({
        name: 'Psyche',
        quantity: 2
      });
      res.gear.push({
        name: 'Novacoke',
        quantity: 2
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
      res.special.spells = ['Eclair mana', 'Tempête de glace', 'Sphère de foudre'];
      switch (rating) {
        case 6:
          res.special.spells.push('Lien mental', 'Confusion');
        case 5:
          res.special.spells.push('Contrôles des pensées', 'Fantasme supérieur');
        case 4:
          res.special.spells.push('Augmentation de réflexes', 'Sens du combat');
        case 3:
          res.special.spells.push('Soins');
        case 2:
          res.special.spells.push('Détection de la magie');
        case 1:
          res.special.spells.push('Invisibilité');
        default:
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
        res.augmentations.push({ name: 'Dépôts dermiques' });
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
      'Veste en cuir synthétique': 1,
      'Costume Actioneer': 2,
      'Vêtements pare-balles': 2,
      'Manteau renforcé': 4,
      'Veste pare-balles': 3,
      'Combinaison caméléon': 2,
      'Armure corporelle intégrale': 5,
      'Armure corporelle intégrale avec casque et isolation chimique': 7,
      'Manteau renforcé': 3,
      'Combinaison Urban Explorer': 3
    };
  },

  get_quality_list: function () {
    return {
      positive: [
        'Ambidextre',
        'Esprit analytique',
        'Caméléon astral',
        'M. Tout le Monde',
        'Première impression',
        'Fou du volant',
        'Tripes',
        'Apparence humaine',
        'Indomptable',
        'Résistance à la magie',
        'Mémoire photographique',
        'Dur à cuire',
        'Rage de vivre I'
      ],
      negative: [
        'Malchance',
        'Mauvaise réputation',
        'Paralysie en combat',
        'Personne(s) à charge I',
        'Style distinctif',
        'Poseur elfe',
        'Gremlins',
        'Insomniaque',
        'Crise de confiance',
        'Poseur ork',
        'Ecorché',
        'Organisme sensible',
        'Asocial',
        'Illetré'
      ]
    };
  },

  get_skill_list: function () {
    return [
      'Astral',
      'Athlétisme',
      'Biotech',
      'Combat rapproché',
      'Escroquerie',
      'Conjuration',
      'Piratage',
      'Electronique',
      'Enchantement',
      'Ingénierie',
      'Armes exotiques',
      'Armes à feu',
      'Influence',
      'Plein air',
      'Perception',
      'Pilotage',
      'Sorcellerie',
      'Furtivité',
      'Technomancie'
    ];
  },

  _augmentation_list: [
    {
      name: 'Augmentation de densité osseuse',
      essence: 0.3,
      max_rating: 4
    },
    {
      name: 'Ossature renforcée',
      essence: 0.5,
      max_rating: 3
    },
    {
      name: 'Cervelet amplifié',
      essence: 0.2,
      max_rating: 2
    },
    {
      name: 'Amplificateur cérébral',
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
      name: 'Cyberleg (Right)',
      essence: 1,
      type: 'full cyberlimb',
      sub_type: 'leg'
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
      name: 'Réservoir d\'air interne',
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
      name: 'Réflexes cablés',
      max_rating: 3
    },
    {
      name: 'Dépôts dermiques',
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
      ability: 'Combat rapproché',
      ar: '9/-/-/-/-',
      dv: 5,
      damage_attribute: 'strength',
      ap: -4
    },

    {
      name: 'Couteau de combat',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '8/2*/-/-/-',
      dv: 3,
      damage_attribute: 'strength',
      ap: -3
    },

    {
      name: 'Couteau',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '6/1*/-/-/-',
      dv: 2,
      damage_attribute: 'strength',
      ap: -1
    },

    {
      name: 'Katana',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '10/-/-/-/-',
      dv: 4,
      damage_attribute: 'strength',
      ap: -3,
    },

    {
      name: 'Epée',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '9/-/-/-/-',
      dv: 3,
      damage_attribute: 'strength',
      ap: -2,
    },

    {
      name: 'Lames d\'avant-bras',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '7/-/-/-/-',
      dv: 3,
      damage_attribute: 'strength',
      ap: -2
    },

    {
      name: 'Armes contondantes',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '6/-/-/-/-',
      dv: 3,
      damage_attribute: 'strength',
    },

    {
      name: 'Baton étourdissant',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '6/-/-/-/-',
      dv: 5,
      damage_type: 'E(e)',
      ap: -5,
    },

    {
      name: 'Matraque',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '8/-/-/-/-',
      dv: 4,
      damage_attribute: 'strength',
    },

    {
      name: 'Matraque téléscopique',
      type: 'Melee',
      ability: 'Combat rapproché',
      ar: '8/-/-/-/-',
      dv: 4,
      damage_attribute: 'strength',
    },

    {
      name: 'Defiance EX Shocker',
      type: 'Taser',
      ability: 'Armes à feu',
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
      ability: 'Armes à feu',
      ar: '8/8/-/-/-',
      dv: 2,
      modes: 'CC',
      ammo_count: 6,
      reload: 'c'
    },

    {
      name: 'Colt America L36',
      type: 'Pistolets légers',
      ability: 'Armes à feu',
      ar: '8/8/6/-/-',
      dv: 2,
      modes: 'SA',
      ammo_count: 11,
      reload: 'c'
    },

    {
      name: 'Fichetti Security 600',
      type: 'Pistolets légers',
      ability: 'Armes à feu',
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
      ability: 'Armes à feu',
      ar: '10/10/8/-/-',
      dv: 3,
      ap: -1,
      modes: 'SA/TR',
      ammo_count: 15,
      reload: 'c'
    },

    {
      name: 'Browning Ultra-Power',
      type: 'Pistolets lourds',
      ability: 'Armes à feu',
      ar: '10/9/6/-/-',
      dv: 3,
      ap: -1,
      modes: 'SA',
      ammo_count: 10,
      reload: 'c'
    },

    {
      name: 'Remington Roomsweeper',
      type: 'Shotgun',
      ability: 'Armes à feu',
      ar: '9/8/4/-/-',
      dv: 5,
      ap: -1,
      modes: 'SA',
      ammo_count: 8,
      reload: 'm'
    },

    {
      name: 'Ceska Black Scorpion',
      type: 'Pistolets mitrailleurs',
      ability: 'Armes à feu',
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
      ability: 'Armes à feu',
      ar: '8/8/6/-/-',
      dv: 2,
      modes: 'SA/TR/TA',
      ammo_count: 30,
      reload: 'c'
    },

    {
      name: 'Colt Cobra TZ-120',
      type: 'Mitraillettes',
      ability: 'Armes à feu',
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
      ability: 'Armes à feu',
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
      ability: 'Armes à feu',
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
      ability: 'Armes à feu',
      ar: '4/11/9/7/1',
      dv: 5,
      ap: -2,
      modes: 'SA/TR/TA',
      ammo_count: 38,
      reload: 'c'
    },

    {
      name: 'Ares Alpha',
      type: 'Fusils d\'assaut',
      ability: 'Armes à feu',
      ar: '4/10/9/7/2',
      dv: 4,
      ap: -2,
      modes: 'SA/TR/TA',
      rc: 2,
      ammo_count: 42,
      reload: 'c'
    },

    {
      name: 'FN HAR',
      type: 'Fusils d\'assaut',
      ability: 'Armes à feu',
      ar: '3/11/10/6/1',
      dv: 5,
      ap: -2,
      modes: 'SA/TR/TA',
      rc: 2,
      ammo_count: 35,
      reload: 'c'
    },

    {
      name: 'Cavalier Arms Crockett EBR',
      type: 'Fusils de précision',
      ability: 'Armes à feu',
      ar: '3/8/11/8/8',
      dv: 5,
      ap: -3,
      modes: 'SA/TR',
      rc_modified: 1,
      ammo_count: 20,
      reload: 'c'
    },

    {
      name: 'Defiance T-250',
      type: 'Shotgun',
      ability: 'Armes à feu',
      ar: '7/10/6/-/-',
      dv: 4,
      ap: -1,
      modes: 'SS/SA',
      ammo_count: 5,
      reload: 'm'
    },

    {
      name: 'Mossberg CMDT',
      type: 'Shotgun',
      ability: 'Armes à feu',
      ar: '4/11/7/-/-',
      dv: 4,
      ap: -1,
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
      ap: -2,
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
      ap: -6,
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
      augments: ['Interface visuelle', 'Smartlink', 'Vision nocturne']
    },
    {
      name: 'Binoculaires',
      rating: 2,
      augments: ['Interface visuelle', 'Smartlink', 'Vision thermographique']
    },
    {
      name: 'Jazz',
      quantity: 2
    },
    {
      name: 'Kamikaze',
      quantity: 2
    },
    {
      name: 'Novacoke',
      quantity: 2
    },
    {
      name: 'Psyche',
      quantity: 2
    },
    {
      name: 'Réactifs',
      quantity: 10
    },
    {
      name: 'Grenade incapacitante',
      quantity: 2
    },
    {
      name: 'Grenade à fragmentation',
      quantity: 1
    },
    {
      name: 'Grenade au gaz (CS/Lacrymo)',
      quantity: 2
    },
    {
      name: 'Grenade fumigène',
      quantity: 2
    },
    {
      name: 'Grenade fumigène thermique',
      quantity: 2
    },
    {
      name: 'Pistolet grappin'
    },
    {
      name: 'Scanner de fréquence',
      rating: 2
    },
    {
      name: 'Lampe-torche'
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
      case 'Athlétisme':
      case 'Combat rapproché':
      case 'Armes exotiques':
      case 'Armes exotiques':
      case 'Armes à feu':
      case 'Furtivité':
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
      case 'Ingénierie':
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
