import { useState, useMemo, useRef } from "react";

// === ITEM DATA ===
// Rarity: M=Mundane, C=Common, U=Uncommon, R=Rare, V=Very Rare, L=Legendary
const RL={"M":"Mundane","C":"Common","U":"Uncommon","R":"Rare","V":"Very Rare","L":"Legendary"};
const RCL={"M":"#888","C":"#2d7d46","U":"#1a7a8a","R":"#8b6914","V":"#7b2d8b","L":"#c0392b"};

// WEAPONS
const W=[
{n:"Club",t:"Simple",c:"M",r:"M",p:0.1,d:"1d4 B",w:2,pr:"Light"},{n:"Dagger",t:"Simple",c:"M",r:"M",p:2,d:"1d4 P",w:1,pr:"Fin,Lt,Thr(20/60)"},
{n:"Greatclub",t:"Simple",c:"M",r:"M",p:0.2,d:"1d8 B",w:10,pr:"Two-handed"},{n:"Handaxe",t:"Simple",c:"M",r:"M",p:5,d:"1d6 S",w:2,pr:"Lt,Thr(20/60)"},
{n:"Javelin",t:"Simple",c:"M",r:"M",p:0.5,d:"1d6 P",w:2,pr:"Thr(30/120)"},{n:"Lt Hammer",t:"Simple",c:"M",r:"M",p:2,d:"1d4 B",w:2,pr:"Lt,Thr(20/60)"},
{n:"Mace",t:"Simple",c:"M",r:"M",p:5,d:"1d6 B",w:4,pr:"-"},{n:"Quarterstaff",t:"Simple",c:"M",r:"M",p:0.2,d:"1d6 B",w:4,pr:"Vers(1d8)"},
{n:"Sickle",t:"Simple",c:"M",r:"M",p:1,d:"1d4 S",w:2,pr:"Light"},{n:"Spear",t:"Simple",c:"M",r:"M",p:1,d:"1d6 P",w:3,pr:"Thr,Vers(1d8)"},
{n:"Lt Crossbow",t:"Simple",c:"R",r:"M",p:25,d:"1d8 P",w:5,pr:"Ammo,Load,2H"},{n:"Dart",t:"Simple",c:"R",r:"M",p:0.05,d:"1d4 P",w:0.25,pr:"Fin,Thr(20/60)"},
{n:"Shortbow",t:"Simple",c:"R",r:"M",p:25,d:"1d6 P",w:2,pr:"Ammo,2H"},{n:"Sling",t:"Simple",c:"R",r:"M",p:0.1,d:"1d4 B",w:0,pr:"Ammo"},
{n:"Battleaxe",t:"Martial",c:"M",r:"M",p:10,d:"1d8 S",w:4,pr:"Vers(1d10)"},{n:"Flail",t:"Martial",c:"M",r:"M",p:10,d:"1d8 B",w:2,pr:"-"},
{n:"Glaive",t:"Martial",c:"M",r:"M",p:20,d:"1d10 S",w:6,pr:"Hvy,Rch,2H"},{n:"Greataxe",t:"Martial",c:"M",r:"M",p:30,d:"1d12 S",w:7,pr:"Hvy,2H"},
{n:"Greatsword",t:"Martial",c:"M",r:"M",p:50,d:"2d6 S",w:6,pr:"Hvy,2H"},{n:"Halberd",t:"Martial",c:"M",r:"M",p:20,d:"1d10 S",w:6,pr:"Hvy,Rch,2H"},
{n:"Lance",t:"Martial",c:"M",r:"M",p:10,d:"1d12 P",w:6,pr:"Rch,Special"},{n:"Longsword",t:"Martial",c:"M",r:"M",p:15,d:"1d8 S",w:3,pr:"Vers(1d10)"},
{n:"Maul",t:"Martial",c:"M",r:"M",p:10,d:"2d6 B",w:10,pr:"Hvy,2H"},{n:"Morningstar",t:"Martial",c:"M",r:"M",p:15,d:"1d8 P",w:4,pr:"-"},
{n:"Pike",t:"Martial",c:"M",r:"M",p:5,d:"1d10 P",w:18,pr:"Hvy,Rch,2H"},{n:"Rapier",t:"Martial",c:"M",r:"M",p:25,d:"1d8 P",w:2,pr:"Fin"},
{n:"Scimitar",t:"Martial",c:"M",r:"M",p:25,d:"1d6 S",w:3,pr:"Fin,Lt"},{n:"Shortsword",t:"Martial",c:"M",r:"M",p:10,d:"1d6 P",w:2,pr:"Fin,Lt"},
{n:"Trident",t:"Martial",c:"M",r:"M",p:5,d:"1d6 P",w:4,pr:"Thr,Vers(1d8)"},{n:"War Pick",t:"Martial",c:"M",r:"M",p:5,d:"1d8 P",w:2,pr:"-"},
{n:"Warhammer",t:"Martial",c:"M",r:"M",p:15,d:"1d8 B",w:2,pr:"Vers(1d10)"},{n:"Whip",t:"Martial",c:"M",r:"M",p:2,d:"1d4 S",w:3,pr:"Fin,Rch"},
{n:"Blowgun",t:"Martial",c:"R",r:"M",p:10,d:"1 P",w:1,pr:"Ammo,Load"},{n:"Hand Crossbow",t:"Martial",c:"R",r:"M",p:75,d:"1d6 P",w:3,pr:"Ammo,Lt,Load"},
{n:"Hvy Crossbow",t:"Martial",c:"R",r:"M",p:50,d:"1d10 P",w:18,pr:"Ammo,Hvy,Load,2H"},{n:"Longbow",t:"Martial",c:"R",r:"M",p:50,d:"1d8 P",w:2,pr:"Ammo,Hvy,2H"},
{n:"Net",t:"Martial",c:"R",r:"M",p:1,d:"-",w:3,pr:"Thr,Special"},{n:"Pistol",t:"Martial",c:"R",r:"M",p:250,d:"1d10 P",w:3,pr:"Ammo,Load"},
{n:"Musket",t:"Martial",c:"R",r:"M",p:500,d:"1d12 P",w:10,pr:"Ammo,Load,2H"},
{n:"Arrows(20)",t:"Ammo",c:"R",r:"M",p:1,d:"-",w:1,pr:"Bow"},{n:"Bolts(20)",t:"Ammo",c:"R",r:"M",p:1,d:"-",w:1.5,pr:"Crossbow"},
{n:"Bullets(10)",t:"Ammo",c:"R",r:"M",p:3,d:"-",w:2,pr:"Firearm"},{n:"Needles(50)",t:"Ammo",c:"R",r:"M",p:1,d:"-",w:1,pr:"Blowgun"},
{n:"Sling Bullets(20)",t:"Ammo",c:"R",r:"M",p:0.04,d:"-",w:1.5,pr:"Sling"},
{n:"Moon-Touched Sword",t:"Martial",c:"M",r:"C",p:100,d:"Base",w:0,pr:"Glow 15ft.+base"},{n:"Silvered Weapon",t:"Any",c:"M",r:"C",p:100,d:"Base",w:0,pr:"Silvered.+base"},
{n:"Sylvan Talon",t:"Martial",c:"M",r:"C",p:100,d:"Base",w:0,pr:"Att.Sylvan.+base"},{n:"Walloping Ammo",t:"Ammo",c:"R",r:"C",p:75,d:"Base",w:0,pr:"DC10 STR prone"},
{n:"Veteran's Cane",t:"Martial",c:"M",r:"C",p:75,d:"Sword",w:1,pr:"BA:becomes sword"},
{n:"+1 Dagger",t:"Simple",c:"M",r:"U",p:302,d:"1d4+1P",w:1,pr:"Fin,Lt,Thr"},{n:"+1 Handaxe",t:"Simple",c:"M",r:"U",p:305,d:"1d6+1S",w:2,pr:"Lt,Thr"},
{n:"+1 Mace",t:"Simple",c:"M",r:"U",p:305,d:"1d6+1B",w:4,pr:"-"},{n:"+1 Quarterstaff",t:"Simple",c:"M",r:"U",p:300,d:"1d6+1B",w:4,pr:"Vers"},
{n:"+1 Spear",t:"Simple",c:"M",r:"U",p:301,d:"1d6+1P",w:3,pr:"Thr,Vers"},
{n:"+1 Battleaxe",t:"Martial",c:"M",r:"U",p:310,d:"1d8+1S",w:4,pr:"Vers"},{n:"+1 Flail",t:"Martial",c:"M",r:"U",p:310,d:"1d8+1B",w:2,pr:"-"},
{n:"+1 Glaive",t:"Martial",c:"M",r:"U",p:320,d:"1d10+1S",w:6,pr:"Hvy,Rch,2H"},{n:"+1 Greataxe",t:"Martial",c:"M",r:"U",p:330,d:"1d12+1S",w:7,pr:"Hvy,2H"},
{n:"+1 Greatsword",t:"Martial",c:"M",r:"U",p:350,d:"2d6+1S",w:6,pr:"Hvy,2H"},{n:"+1 Halberd",t:"Martial",c:"M",r:"U",p:320,d:"1d10+1S",w:6,pr:"Hvy,Rch,2H"},
{n:"+1 Lance",t:"Martial",c:"M",r:"U",p:310,d:"1d12+1P",w:6,pr:"Rch"},{n:"+1 Longsword",t:"Martial",c:"M",r:"U",p:315,d:"1d8+1S",w:3,pr:"Vers"},
{n:"+1 Maul",t:"Martial",c:"M",r:"U",p:310,d:"2d6+1B",w:10,pr:"Hvy,2H"},{n:"+1 Morningstar",t:"Martial",c:"M",r:"U",p:315,d:"1d8+1P",w:4,pr:"-"},
{n:"+1 Pike",t:"Martial",c:"M",r:"U",p:305,d:"1d10+1P",w:18,pr:"Hvy,Rch,2H"},{n:"+1 Rapier",t:"Martial",c:"M",r:"U",p:325,d:"1d8+1P",w:2,pr:"Fin"},
{n:"+1 Scimitar",t:"Martial",c:"M",r:"U",p:325,d:"1d6+1S",w:3,pr:"Fin,Lt"},{n:"+1 Shortsword",t:"Martial",c:"M",r:"U",p:310,d:"1d6+1P",w:2,pr:"Fin,Lt"},
{n:"+1 Trident",t:"Martial",c:"M",r:"U",p:305,d:"1d6+1P",w:4,pr:"Thr,Vers"},{n:"+1 War Pick",t:"Martial",c:"M",r:"U",p:305,d:"1d8+1P",w:2,pr:"-"},
{n:"+1 Warhammer",t:"Martial",c:"M",r:"U",p:315,d:"1d8+1B",w:2,pr:"Vers"},{n:"+1 Whip",t:"Martial",c:"M",r:"U",p:302,d:"1d4+1S",w:3,pr:"Fin,Rch"},
{n:"+1 Lt Crossbow",t:"Simple",c:"R",r:"U",p:325,d:"1d8+1P",w:5,pr:"Load,2H"},{n:"+1 Shortbow",t:"Simple",c:"R",r:"U",p:325,d:"1d6+1P",w:2,pr:"2H"},
{n:"+1 Hand Crossbow",t:"Martial",c:"R",r:"U",p:375,d:"1d6+1P",w:3,pr:"Lt,Load"},{n:"+1 Hvy Crossbow",t:"Martial",c:"R",r:"U",p:350,d:"1d10+1P",w:18,pr:"Hvy,Load,2H"},
{n:"+1 Longbow",t:"Martial",c:"R",r:"U",p:350,d:"1d8+1P",w:2,pr:"Hvy,2H"},{n:"+1 Pistol",t:"Martial",c:"R",r:"U",p:550,d:"1d10+1P",w:3,pr:"Load"},
{n:"+1 Musket",t:"Martial",c:"R",r:"U",p:800,d:"1d12+1P",w:10,pr:"Load,2H"},{n:"+1 Ammo(20)",t:"Ammo",c:"R",r:"U",p:300,d:"+1/hit",w:1,pr:"Consumed"},
{n:"Adamantine Wpn",t:"Any",c:"M",r:"U",p:300,d:"Base",w:0,pr:"Crit objects.+base"},{n:"Javelin of Lightning",t:"Simple",c:"M",r:"U",p:350,d:"1d6+4d6lgtn",w:2,pr:"Line then normal"},
{n:"Sword of Vengeance",t:"Martial",c:"M",r:"U",p:325,d:"Base+1",w:0,pr:"Att.Cursed.+base"},{n:"Trident of Fish Cmd",t:"Martial",c:"M",r:"U",p:325,d:"1d6+1P",w:4,pr:"Att.Dominate fish"},
{n:"Weapon of Warning",t:"Any",c:"M",r:"U",p:350,d:"Base",w:0,pr:"Att.No surprise,adv init"},{n:"Enspelled Wpn(cantrip)",t:"Any",c:"M",r:"U",p:325,d:"Base",w:0,pr:"Att.Cantrip 6/day"},
{n:"Enspelled Wpn(1st)",t:"Any",c:"M",r:"U",p:375,d:"Base",w:0,pr:"Att.1st 6/day"},
{n:"+2 Dagger",t:"Simple",c:"M",r:"R",p:1500,d:"1d4+2P",w:1,pr:"Fin,Lt,Thr"},{n:"+2 Handaxe",t:"Simple",c:"M",r:"R",p:1500,d:"1d6+2S",w:2,pr:"Lt,Thr"},
{n:"+2 Mace",t:"Simple",c:"M",r:"R",p:1500,d:"1d6+2B",w:4,pr:"-"},{n:"+2 Quarterstaff",t:"Simple",c:"M",r:"R",p:1500,d:"1d6+2B",w:4,pr:"Vers"},
{n:"+2 Spear",t:"Simple",c:"M",r:"R",p:1500,d:"1d6+2P",w:3,pr:"Thr,Vers"},
{n:"+2 Battleaxe",t:"Martial",c:"M",r:"R",p:1600,d:"1d8+2S",w:4,pr:"Vers"},{n:"+2 Flail",t:"Martial",c:"M",r:"R",p:1600,d:"1d8+2B",w:2,pr:"-"},
{n:"+2 Glaive",t:"Martial",c:"M",r:"R",p:1750,d:"1d10+2S",w:6,pr:"Hvy,Rch,2H"},{n:"+2 Greataxe",t:"Martial",c:"M",r:"R",p:1800,d:"1d12+2S",w:7,pr:"Hvy,2H"},
{n:"+2 Greatsword",t:"Martial",c:"M",r:"R",p:1850,d:"2d6+2S",w:6,pr:"Hvy,2H"},{n:"+2 Halberd",t:"Martial",c:"M",r:"R",p:1750,d:"1d10+2S",w:6,pr:"Hvy,Rch,2H"},
{n:"+2 Longsword",t:"Martial",c:"M",r:"R",p:1650,d:"1d8+2S",w:3,pr:"Vers"},{n:"+2 Maul",t:"Martial",c:"M",r:"R",p:1750,d:"2d6+2B",w:10,pr:"Hvy,2H"},
{n:"+2 Morningstar",t:"Martial",c:"M",r:"R",p:1600,d:"1d8+2P",w:4,pr:"-"},{n:"+2 Pike",t:"Martial",c:"M",r:"R",p:1600,d:"1d10+2P",w:18,pr:"Hvy,Rch,2H"},
{n:"+2 Rapier",t:"Martial",c:"M",r:"R",p:1700,d:"1d8+2P",w:2,pr:"Fin"},{n:"+2 Scimitar",t:"Martial",c:"M",r:"R",p:1650,d:"1d6+2S",w:3,pr:"Fin,Lt"},
{n:"+2 Shortsword",t:"Martial",c:"M",r:"R",p:1600,d:"1d6+2P",w:2,pr:"Fin,Lt"},{n:"+2 Trident",t:"Martial",c:"M",r:"R",p:1550,d:"1d6+2P",w:4,pr:"Thr,Vers"},
{n:"+2 War Pick",t:"Martial",c:"M",r:"R",p:1550,d:"1d8+2P",w:2,pr:"-"},{n:"+2 Warhammer",t:"Martial",c:"M",r:"R",p:1650,d:"1d8+2B",w:2,pr:"Vers"},
{n:"+2 Lt Crossbow",t:"Simple",c:"R",r:"R",p:1700,d:"1d8+2P",w:5,pr:"Load,2H"},{n:"+2 Shortbow",t:"Simple",c:"R",r:"R",p:1700,d:"1d6+2P",w:2,pr:"2H"},
{n:"+2 Hand Crossbow",t:"Martial",c:"R",r:"R",p:1750,d:"1d6+2P",w:3,pr:"Lt,Load"},{n:"+2 Hvy Crossbow",t:"Martial",c:"R",r:"R",p:1800,d:"1d10+2P",w:18,pr:"Hvy,Load,2H"},
{n:"+2 Longbow",t:"Martial",c:"R",r:"R",p:1800,d:"1d8+2P",w:2,pr:"Hvy,2H"},{n:"+2 Pistol",t:"Martial",c:"R",r:"R",p:1900,d:"1d10+2P",w:3,pr:"Load"},
{n:"+2 Musket",t:"Martial",c:"R",r:"R",p:2000,d:"1d12+2P",w:10,pr:"Load,2H"},{n:"+2 Ammo(20)",t:"Ammo",c:"R",r:"R",p:1500,d:"+2/hit",w:1,pr:"Consumed"},
{n:"Berserker Axe",t:"Martial",c:"M",r:"R",p:1600,d:"Base+1+1d6",w:0,pr:"Att.Cursed.+base"},{n:"Dagger of Venom",t:"Simple",c:"M",r:"R",p:1600,d:"1d4+1P",w:1,pr:"1/day:+2d10 poison"},
{n:"Dragon Slayer",t:"Any",c:"M",r:"R",p:1800,d:"Base+1",w:0,pr:"+3d6 vs dragons"},{n:"Flame Tongue",t:"Any",c:"M",r:"R",p:2000,d:"Base+2d6fire",w:0,pr:"Att.BA:ignite"},
{n:"Giant Slayer",t:"Any",c:"M",r:"R",p:1750,d:"Base+1",w:0,pr:"+2d6 vs giants"},{n:"Mace of Disruption",t:"Simple",c:"M",r:"R",p:1750,d:"1d6+2d6rad",w:4,pr:"Att.Destroy undead<25HP"},
{n:"Mace of Smiting",t:"Simple",c:"M",r:"R",p:1700,d:"1d6",w:4,pr:"+7 crit.Constructs"},{n:"Mace of Terror",t:"Simple",c:"M",r:"R",p:1750,d:"1d6 B",w:4,pr:"Att.3chg Frighten"},
{n:"Sun Blade",t:"Martial",c:"M",r:"R",p:2000,d:"1d8+2 rad",w:3,pr:"Att.Fin.+1d8 undead"},{n:"Sword of Life Stealing",t:"Martial",c:"M",r:"R",p:1800,d:"Base",w:0,pr:"Att.Crit:+10necr"},
{n:"Sword of Wounding",t:"Martial",c:"M",r:"R",p:1850,d:"Base+2d6necr",w:0,pr:"Att.Reduce HP max"},{n:"Vicious Weapon",t:"Any",c:"M",r:"R",p:1500,d:"Base",w:0,pr:"Crit:+2d6"},
{n:"Enspelled Wpn(2nd)",t:"Any",c:"M",r:"R",p:1650,d:"Base",w:0,pr:"Att.2nd 6/day"},{n:"Enspelled Wpn(3rd)",t:"Any",c:"M",r:"R",p:1850,d:"Base",w:0,pr:"Att.3rd 6/day"},
{n:"+3 Dagger",t:"Simple",c:"M",r:"V",p:5000,d:"1d4+3P",w:1,pr:"Fin,Lt,Thr"},{n:"+3 Longsword",t:"Martial",c:"M",r:"V",p:5500,d:"1d8+3S",w:3,pr:"Vers"},
{n:"+3 Greatsword",t:"Martial",c:"M",r:"V",p:6000,d:"2d6+3S",w:6,pr:"Hvy,2H"},{n:"+3 Greataxe",t:"Martial",c:"M",r:"V",p:6000,d:"1d12+3S",w:7,pr:"Hvy,2H"},
{n:"+3 Rapier",t:"Martial",c:"M",r:"V",p:5500,d:"1d8+3P",w:2,pr:"Fin"},{n:"+3 Battleaxe",t:"Martial",c:"M",r:"V",p:5200,d:"1d8+3S",w:4,pr:"Vers"},
{n:"+3 Warhammer",t:"Martial",c:"M",r:"V",p:5200,d:"1d8+3B",w:2,pr:"Vers"},{n:"+3 Shortsword",t:"Martial",c:"M",r:"V",p:5200,d:"1d6+3P",w:2,pr:"Fin,Lt"},
{n:"+3 Scimitar",t:"Martial",c:"M",r:"V",p:5200,d:"1d6+3S",w:3,pr:"Fin,Lt"},{n:"+3 Glaive",t:"Martial",c:"M",r:"V",p:5500,d:"1d10+3S",w:6,pr:"Hvy,Rch,2H"},
{n:"+3 Halberd",t:"Martial",c:"M",r:"V",p:5500,d:"1d10+3S",w:6,pr:"Hvy,Rch,2H"},{n:"+3 Maul",t:"Martial",c:"M",r:"V",p:5500,d:"2d6+3B",w:10,pr:"Hvy,2H"},
{n:"+3 Longbow",t:"Martial",c:"R",r:"V",p:5800,d:"1d8+3P",w:2,pr:"Hvy,2H"},{n:"+3 Hand Crossbow",t:"Martial",c:"R",r:"V",p:5800,d:"1d6+3P",w:3,pr:"Lt,Load"},
{n:"+3 Hvy Crossbow",t:"Martial",c:"R",r:"V",p:6000,d:"1d10+3P",w:18,pr:"Hvy,Load,2H"},{n:"+3 Ammo(20)",t:"Ammo",c:"R",r:"V",p:5000,d:"+3/hit",w:1,pr:"Consumed"},
{n:"Ammo of Slaying",t:"Ammo",c:"R",r:"V",p:5500,d:"+6d10 vs type",w:0,pr:"Choose type.1pc"},
{n:"Dancing Sword",t:"Martial",c:"M",r:"V",p:7000,d:"Base",w:0,pr:"Att.BA:animate"},{n:"Dwarven Thrower",t:"Martial",c:"M",r:"V",p:7500,d:"1d8+3B",w:2,pr:"Att(dwarf).Returns"},
{n:"Energy Bow",t:"Martial",c:"R",r:"V",p:6500,d:"1d8+1force",w:2,pr:"Att.No ammo"},{n:"Enspelled Wpn(4th)",t:"Any",c:"M",r:"V",p:6000,d:"Base",w:0,pr:"Att.4th 6/day"},
{n:"Enspelled Wpn(5th)",t:"Any",c:"M",r:"V",p:7000,d:"Base",w:0,pr:"Att.5th 6/day"},{n:"Executioner's Axe",t:"Martial",c:"M",r:"V",p:6500,d:"Base+1d6necr",w:0,pr:"Crit:max dice"},
{n:"Frost Brand",t:"Martial",c:"M",r:"V",p:7000,d:"Base+2d6cold",w:0,pr:"Att.Fire resist"},{n:"Lute Thund.Thump",t:"Simple",c:"M",r:"V",p:6000,d:"1d8+2d8thund",w:2,pr:"Club.Att.CHA atk"},
{n:"Nine Lives Stealer",t:"Martial",c:"M",r:"V",p:7500,d:"Base+2",w:0,pr:"Att.Crit<100HP:kill"},{n:"Oathbow",t:"Martial",c:"R",r:"V",p:7000,d:"1d8+3d6P",w:2,pr:"Att.Sworn enemy"},
{n:"QStaff of Acrobat",t:"Simple",c:"M",r:"V",p:6000,d:"1d6+2B",w:4,pr:"Att.Climb+jump"},{n:"Scimitar of Speed",t:"Martial",c:"M",r:"V",p:8000,d:"1d6+2S",w:3,pr:"Att.BA:extra atk"},
{n:"Sword of Sharpness",t:"Martial",c:"M",r:"V",p:7500,d:"Base",w:0,pr:"Att.Max=extra"},{n:"Thunderous Greatclub",t:"Simple",c:"M",r:"V",p:6000,d:"1d8+2d8thund",w:10,pr:"Att.Push 20ft"},
{n:"Defender",t:"Any",c:"M",r:"L",p:45000,d:"Base+3",w:0,pr:"Att.Transfer+to AC"},{n:"Hammer of Thunderbolts",t:"Martial",c:"M",r:"L",p:50000,d:"2d6+3B",w:10,pr:"Att.Stun giants"},
{n:"Holy Avenger",t:"Any",c:"M",r:"L",p:50000,d:"Base+3",w:0,pr:"Att(pal).+2d10rad"},{n:"Luck Blade",t:"Martial",c:"M",r:"L",p:50000,d:"Base+1",w:0,pr:"Att.+1 saves.Wishes"},
{n:"Moonblade",t:"Martial",c:"M",r:"L",p:45000,d:"Base+runes",w:0,pr:"Att.Sentient"},{n:"Sword of Answering",t:"Martial",c:"M",r:"L",p:45000,d:"1d8+3S",w:3,pr:"Att.React:attack"},
{n:"Vorpal Sword",t:"Martial",c:"M",r:"L",p:50000,d:"Base+3",w:0,pr:"Att.Nat20:decapitate"},
{n:"Enspelled Wpn(6th)",t:"Any",c:"M",r:"L",p:42000,d:"Base",w:0,pr:"Att.6th 6/day"},{n:"Enspelled Wpn(7th)",t:"Any",c:"M",r:"L",p:45000,d:"Base",w:0,pr:"Att.7th 6/day"},
{n:"Enspelled Wpn(8th)",t:"Any",c:"M",r:"L",p:48000,d:"Base",w:0,pr:"Att.8th 6/day"},
];

// ARMOR
const ARM=[
{n:"Padded",t:"Light",r:"M",ac:"11+Dex",p:5,w:8,sr:"-",sd:"Y"},{n:"Leather",t:"Light",r:"M",ac:"11+Dex",p:10,w:10,sr:"-",sd:"N"},
{n:"Studded Leather",t:"Light",r:"M",ac:"12+Dex",p:45,w:13,sr:"-",sd:"N"},{n:"Hide",t:"Medium",r:"M",ac:"12+D2",p:10,w:12,sr:"-",sd:"N"},
{n:"Chain Shirt",t:"Medium",r:"M",ac:"13+D2",p:50,w:20,sr:"-",sd:"N"},{n:"Scale Mail",t:"Medium",r:"M",ac:"14+D2",p:50,w:45,sr:"-",sd:"Y"},
{n:"Breastplate",t:"Medium",r:"M",ac:"14+D2",p:400,w:20,sr:"-",sd:"N"},{n:"Half Plate",t:"Medium",r:"M",ac:"15+D2",p:750,w:40,sr:"-",sd:"Y"},
{n:"Ring Mail",t:"Heavy",r:"M",ac:"14",p:30,w:40,sr:"-",sd:"Y"},{n:"Chain Mail",t:"Heavy",r:"M",ac:"16",p:75,w:55,sr:"13",sd:"Y"},
{n:"Splint",t:"Heavy",r:"M",ac:"17",p:200,w:60,sr:"15",sd:"Y"},{n:"Plate",t:"Heavy",r:"M",ac:"18",p:1500,w:65,sr:"15",sd:"Y"},
{n:"Shield",t:"Shield",r:"M",ac:"+2",p:10,w:6,sr:"-",sd:"N"},
{n:"Armor of Gleaming",t:"Any",r:"C",ac:"Base",p:100,w:0,sr:"-",sd:"Base"},{n:"Cast-Off Armor",t:"Any",r:"C",ac:"Base",p:100,w:0,sr:"-",sd:"Base"},
{n:"Smoldering Armor",t:"Any",r:"C",ac:"Base",p:100,w:0,sr:"-",sd:"Base"},{n:"Shield of Expression",t:"Shield",r:"C",ac:"+2",p:85,w:6,sr:"-",sd:"N"},
{n:"+1 Leather",t:"Light",r:"U",ac:"12+Dex",p:310,w:10,sr:"-",sd:"N"},{n:"+1 Studded Leather",t:"Light",r:"U",ac:"13+Dex",p:345,w:13,sr:"-",sd:"N"},
{n:"+1 Hide",t:"Medium",r:"U",ac:"13+D2",p:310,w:12,sr:"-",sd:"N"},{n:"+1 Chain Shirt",t:"Medium",r:"U",ac:"14+D2",p:350,w:20,sr:"-",sd:"N"},
{n:"+1 Scale Mail",t:"Medium",r:"U",ac:"15+D2",p:350,w:45,sr:"-",sd:"Y"},{n:"+1 Breastplate",t:"Medium",r:"U",ac:"15+D2",p:700,w:20,sr:"-",sd:"N"},
{n:"+1 Half Plate",t:"Medium",r:"U",ac:"16+D2",p:1050,w:40,sr:"-",sd:"Y"},{n:"+1 Ring Mail",t:"Heavy",r:"U",ac:"15",p:330,w:40,sr:"-",sd:"Y"},
{n:"+1 Chain Mail",t:"Heavy",r:"U",ac:"17",p:375,w:55,sr:"13",sd:"Y"},{n:"+1 Splint",t:"Heavy",r:"U",ac:"18",p:500,w:60,sr:"15",sd:"Y"},
{n:"+1 Plate",t:"Heavy",r:"U",ac:"19",p:1800,w:65,sr:"15",sd:"Y"},{n:"+1 Shield",t:"Shield",r:"U",ac:"+3",p:310,w:6,sr:"-",sd:"N"},
{n:"Adamantine Armor",t:"Med/Hvy",r:"U",ac:"Base",p:350,w:0,sr:"Base",sd:"Base"},{n:"Mithral Armor",t:"Med/Hvy",r:"U",ac:"Base",p:350,w:0,sr:"None",sd:"N"},
{n:"Mariner's Armor",t:"Any",r:"U",ac:"Base",p:375,w:0,sr:"Base",sd:"Base"},{n:"Sentinel Shield",t:"Shield",r:"U",ac:"+2",p:350,w:6,sr:"-",sd:"N"},
{n:"Enspelled Armor(cantrip)",t:"Any",r:"U",ac:"Base",p:325,w:0,sr:"Base",sd:"Base"},{n:"Enspelled Armor(1st)",t:"Any",r:"U",ac:"Base",p:375,w:0,sr:"Base",sd:"Base"},
{n:"+2 Leather",t:"Light",r:"R",ac:"13+Dex",p:1500,w:10,sr:"-",sd:"N"},{n:"+2 Studded Leather",t:"Light",r:"R",ac:"14+Dex",p:1550,w:13,sr:"-",sd:"N"},
{n:"+2 Chain Shirt",t:"Medium",r:"R",ac:"15+D2",p:1600,w:20,sr:"-",sd:"N"},{n:"+2 Scale Mail",t:"Medium",r:"R",ac:"16+D2",p:1600,w:45,sr:"-",sd:"Y"},
{n:"+2 Breastplate",t:"Medium",r:"R",ac:"16+D2",p:1800,w:20,sr:"-",sd:"N"},{n:"+2 Half Plate",t:"Medium",r:"R",ac:"17+D2",p:2000,w:40,sr:"-",sd:"Y"},
{n:"+2 Chain Mail",t:"Heavy",r:"R",ac:"18",p:1650,w:55,sr:"13",sd:"Y"},{n:"+2 Splint",t:"Heavy",r:"R",ac:"19",p:1750,w:60,sr:"15",sd:"Y"},
{n:"+2 Plate",t:"Heavy",r:"R",ac:"20",p:3000,w:65,sr:"15",sd:"Y"},{n:"+2 Shield",t:"Shield",r:"R",ac:"+4",p:1600,w:6,sr:"-",sd:"N"},
{n:"Armor of Resistance",t:"Any",r:"R",ac:"Base",p:1800,w:0,sr:"Base",sd:"Base"},{n:"Armor of Vulnerability",t:"Any",r:"R",ac:"Base",p:1600,w:0,sr:"Base",sd:"Base"},
{n:"Arrow-Catching Shield",t:"Shield",r:"R",ac:"+2",p:1750,w:6,sr:"-",sd:"N"},{n:"Elven Chain",t:"Medium",r:"R",ac:"14+D2",p:1700,w:20,sr:"-",sd:"N"},
{n:"Glamoured Studded Leather",t:"Light",r:"R",ac:"12+Dex",p:1600,w:13,sr:"-",sd:"N"},{n:"Shield Missile Attr.",t:"Shield",r:"R",ac:"+2",p:1500,w:6,sr:"-",sd:"N"},
{n:"Enspelled Armor(2nd)",t:"Any",r:"R",ac:"Base",p:1650,w:0,sr:"Base",sd:"Base"},{n:"Enspelled Armor(3rd)",t:"Any",r:"R",ac:"Base",p:1850,w:0,sr:"Base",sd:"Base"},
{n:"Animated Shield",t:"Shield",r:"V",ac:"+2",p:6000,w:6,sr:"-",sd:"N"},{n:"+2 Armor(any)",t:"Any",r:"V",ac:"Base+2",p:6000,w:0,sr:"Base",sd:"Base"},
{n:"Demon Armor",t:"Heavy",r:"V",ac:"21",p:6500,w:65,sr:"15",sd:"Y"},{n:"Dragon Scale Mail",t:"Medium",r:"V",ac:"16+D2",p:7000,w:45,sr:"-",sd:"N"},
{n:"Dwarven Plate",t:"Heavy",r:"V",ac:"20",p:7500,w:65,sr:"15",sd:"Y"},{n:"Shield of Cavalier",t:"Shield",r:"V",ac:"+2",p:6500,w:6,sr:"-",sd:"N"},
{n:"+3 Shield",t:"Shield",r:"V",ac:"+5",p:6000,w:6,sr:"-",sd:"N"},{n:"Spellguard Shield",t:"Shield",r:"V",ac:"+2",p:7000,w:6,sr:"-",sd:"N"},
{n:"Enspelled Armor(4th)",t:"Any",r:"V",ac:"Base",p:6000,w:0,sr:"Base",sd:"Base"},{n:"Enspelled Armor(5th)",t:"Any",r:"V",ac:"Base",p:7000,w:0,sr:"Base",sd:"Base"},
{n:"Armor of Invulnerability",t:"Heavy",r:"L",ac:"18",p:50000,w:65,sr:"15",sd:"Y"},{n:"+3 Armor(any)",t:"Any",r:"L",ac:"Base+3",p:45000,w:0,sr:"Base",sd:"Base"},
{n:"Efreeti Chain",t:"Heavy",r:"L",ac:"16",p:45000,w:55,sr:"-",sd:"N"},{n:"Plate of Etherealness",t:"Heavy",r:"L",ac:"18",p:50000,w:65,sr:"15",sd:"Y"},
{n:"Enspelled Armor(6th)",t:"Any",r:"L",ac:"Base",p:42000,w:0,sr:"Base",sd:"Base"},{n:"Enspelled Armor(7th)",t:"Any",r:"L",ac:"Base",p:45000,w:0,sr:"Base",sd:"Base"},
{n:"Enspelled Armor(8th)",t:"Any",r:"L",ac:"Base",p:48000,w:0,sr:"Base",sd:"Base"},
];

// ALCHEMY - NO tools, instruments, gaming sets
const AL=[
{n:"Acid(vial)",r:"M",p:25,w:1,no:"2d6 acid,thrown"},{n:"Alchemist's Fire",r:"M",p:50,w:1,no:"1d4 fire/turn"},{n:"Alchemist's Supplies",r:"M",p:50,w:8,no:"Prof tool"},
{n:"Antitoxin",r:"M",p:50,w:0,no:"Adv vs poison 1hr"},{n:"Healer's Kit(10)",r:"M",p:5,w:3,no:"Stabilize at 0HP"},{n:"Herbalism Kit",r:"M",p:5,w:3,no:"Prof tool"},
{n:"Oil(flask)",r:"M",p:0.1,w:1,no:"Fire 2 rounds"},{n:"Perfume",r:"M",p:5,w:0,no:"-"},{n:"Poison,Basic",r:"M",p:100,w:0,no:"DC10 CON,1d4"},
{n:"Poisoner's Kit",r:"M",p:50,w:2,no:"Prof tool"},
{n:"Candle of Deep",r:"C",p:75,w:0,no:"Burns underwater"},{n:"Spice Pouch",r:"C",p:75,w:1,no:"10chg.Seasoning"},{n:"Perfume of Bewitching",r:"C",p:75,w:0,no:"Adv CHA 1hr"},
{n:"Oil of Slipperiness",r:"U",p:125,w:0,no:"Freedom of Mvmt 8hr"},{n:"Keoghtom's Ointment",r:"U",p:150,w:0,no:"5 doses.2d8+2 heal"},
{n:"Dust of Disappearance",r:"U",p:125,w:0,no:"Invisible 2d4 min"},{n:"Dust of Dryness",r:"U",p:100,w:0,no:"Absorb 15ft water"},
{n:"Dust of Sneezing",r:"U",p:100,w:0,no:"Incapacitate,CON save"},{n:"Elem.Gem(Sapphire)",r:"U",p:150,w:0,no:"Summon Water Elem"},
{n:"Elem.Gem(Emerald)",r:"U",p:150,w:0,no:"Summon Earth Elem"},{n:"Elem.Gem(Corundum)",r:"U",p:150,w:0,no:"Summon Fire Elem"},
{n:"Elem.Gem(Diamond)",r:"U",p:150,w:0,no:"Summon Air Elem"},
{n:"Elixir of Health",r:"R",p:275,w:0,no:"Cure disease/conditions"},{n:"Oil of Etherealness",r:"R",p:300,w:0,no:"Ethereal Plane 1hr"},
{n:"Oil of Sharpness",r:"V",p:650,w:0,no:"+3 weapon/ammo 1hr"},
{n:"Potion of Healing",r:"C",p:50,w:0.5,no:"2d4+2 HP"},{n:"Potion of Climbing",r:"C",p:50,w:0.5,no:"Climb=walk 1hr"},
{n:"Potion Animal Friend",r:"C",p:50,w:0.5,no:"Animal Friendship 1hr"},{n:"Potion Comprehension",r:"C",p:50,w:0.5,no:"Understand languages 1hr"},
{n:"Potion Greater Healing",r:"U",p:150,w:0.5,no:"4d4+4 HP"},{n:"Potion Fire Breath",r:"U",p:125,w:0.5,no:"Exhale fire(4d6)x3"},
{n:"Potion Water Breathing",r:"U",p:100,w:0.5,no:"Breathe underwater 1hr"},{n:"Potion Resistance",r:"U",p:100,w:0.5,no:"Resist one type 1hr"},
{n:"Potion Giant Str(Hill)",r:"U",p:125,w:0.5,no:"STR 21, 1hr"},{n:"Potion of Growth",r:"U",p:100,w:0.5,no:"Enlarge 1d4hr"},
{n:"Potion of Poison",r:"U",p:100,w:0.5,no:"Looks like healing.3d6 poison"},{n:"Potion of Pugilism",r:"U",p:100,w:0.5,no:"Unarmed 1d8+STR 10min"},
{n:"Philter of Love",r:"U",p:100,w:0.5,no:"Charmed 1hr"},
{n:"Potion of Diminution",r:"R",p:275,w:0.5,no:"Reduce 1d4hr"},{n:"Potion of Heroism",r:"R",p:275,w:0.5,no:"10 temp HP+Bless 1hr"},
{n:"Potion of Invisibility",r:"R",p:275,w:0.5,no:"Invisible 1hr"},{n:"Potion Invulnerability",r:"R",p:300,w:0.5,no:"Resist all dmg 1min"},
{n:"Potion Giant Str(Fire)",r:"R",p:275,w:0.5,no:"STR 25, 1hr"},
{n:"Potion Superior Healing",r:"R",p:250,w:0.5,no:"8d4+8 HP"},{n:"Potion Giant Str(Frost)",r:"R",p:275,w:0.5,no:"STR 23, 1hr"},
{n:"Potion Giant Str(Stone)",r:"R",p:275,w:0.5,no:"STR 23, 1hr"},{n:"Potion Mind Reading",r:"R",p:275,w:0.5,no:"Detect Thoughts"},
{n:"Potion Clairvoyance",r:"R",p:300,w:0.5,no:"Cast Clairvoyance"},{n:"Potion Gaseous Form",r:"R",p:275,w:0.5,no:"Gaseous Form 1hr"},
{n:"Potion Supreme Healing",r:"V",p:550,w:0.5,no:"10d4+20 HP"},{n:"Potion of Flying",r:"V",p:650,w:0.5,no:"Fly 60ft 1hr"},
{n:"Potion of Speed",r:"V",p:700,w:0.5,no:"Haste 1min"},{n:"Potion Greater Invis",r:"V",p:650,w:0.5,no:"Invisible+attack"},
{n:"Potion Giant Str(Cloud)",r:"V",p:650,w:0.5,no:"STR 27, 1hr"},{n:"Potion of Vitality",r:"V",p:650,w:0.5,no:"Cure exhaustion/disease"},
{n:"Potion of Longevity",r:"V",p:700,w:0.5,no:"Younger 1d6+6yr"},
{n:"Potion Giant Str(Storm)",r:"L",p:2000,w:0.5,no:"STR 29, 1hr"},
];

// ARCANE SUPPLIES
const ARC=[
{n:"Focus-Crystal",r:"M",p:10,w:1,no:"Arcane focus"},{n:"Focus-Orb",r:"M",p:20,w:3,no:"Arcane focus"},{n:"Focus-Rod",r:"M",p:10,w:2,no:"Arcane focus"},
{n:"Focus-Staff",r:"M",p:5,w:4,no:"Arcane focus"},{n:"Focus-Wand",r:"M",p:10,w:1,no:"Arcane focus"},{n:"Component Pouch",r:"M",p:25,w:2,no:"Material components"},
{n:"Spellbook",r:"M",p:50,w:3,no:"100 pages"},{n:"Holy-Amulet",r:"M",p:5,w:1,no:"Divine focus"},{n:"Holy-Emblem",r:"M",p:5,w:0,no:"Divine,on shield"},
{n:"Holy-Reliquary",r:"M",p:5,w:2,no:"Divine focus"},{n:"Druid-Mistletoe",r:"M",p:1,w:0,no:"Druidic focus"},{n:"Druid-Totem",r:"M",p:1,w:0,no:"Druidic focus"},
{n:"Druid-Staff",r:"M",p:5,w:4,no:"Druidic focus"},{n:"Druid-YewWand",r:"M",p:10,w:1,no:"Druidic focus"},{n:"Ink(1oz)",r:"M",p:10,w:0,no:"-"},
{n:"Navigator's Tools",r:"M",p:25,w:2,no:"Prof tool"},{n:"Cartographer's Tools",r:"M",p:15,w:6,no:"Prof tool"},
{n:"Dark Shard Amulet",r:"C",p:100,w:1,no:"Warlock focus.1/LR cantrip"},{n:"Enduring Spellbook",r:"C",p:100,w:3,no:"Immune fire/water"},
{n:"Hat of Wizardry",r:"C",p:100,w:0,no:"Wizard focus.1/LR cantrip"},{n:"Instr.of Illusions",r:"C",p:100,w:0,no:"Illusion while playing"},
{n:"Instr.of Scribing",r:"C",p:100,w:0,no:"Messages while playing"},{n:"Orb of Direction",r:"C",p:75,w:0,no:"Find north"},
{n:"Orb of Time",r:"C",p:75,w:0,no:"Current time"},{n:"Ruby of War Mage",r:"C",p:100,w:0,no:"Weapon=focus.Attune"},
{n:"Staff of Adornment",r:"C",p:75,w:4,no:"Orbiting baubles"},{n:"Staff of Birdcalls",r:"C",p:75,w:4,no:"10chg.Bird sounds"},
{n:"Staff of Flowers",r:"C",p:75,w:4,no:"10chg.Produce flowers"},{n:"Wand of Conducting",r:"C",p:75,w:0,no:"3chg.Orchestral flourish"},
{n:"Wand of Pyrotechnics",r:"C",p:100,w:0,no:"7chg.Fireworks"},{n:"Wand of Scowls",r:"C",p:75,w:0,no:"3chg.Target scowls"},
{n:"Wand of Smiles",r:"C",p:75,w:0,no:"3chg.Target smiles"},
{n:"Enspelled Staff(cantrip)",r:"U",p:325,w:4,no:"Att.Cantrip 6/day"},{n:"Enspelled Staff(1st)",r:"U",p:375,w:4,no:"Att.1st lvl 6/day"},
{n:"Staff of Adder",r:"U",p:350,w:4,no:"Att.Snake head attack"},{n:"Staff of Python",r:"U",p:375,w:4,no:"Att.Giant Constrictor"},
{n:"Wand Magic Detection",r:"U",p:325,w:0,no:"3chg.Detect Magic"},{n:"Wand Magic Missiles",r:"U",p:375,w:0,no:"7chg.Magic Missile"},
{n:"Wand of Secrets",r:"U",p:300,w:0,no:"3chg.Detect traps/doors"},{n:"Wand of Web",r:"U",p:350,w:0,no:"Att.7chg.Web"},
{n:"Wand War Mage+1",r:"U",p:375,w:0,no:"Att.+1 spell atk"},{n:"Rod Pact Keeper+1",r:"U",p:375,w:2,no:"Att(warlock).+1 atk/DC"},
{n:"Immovable Rod",r:"U",p:325,w:2,no:"Fixes in place.8000lbs"},{n:"Pearl of Power",r:"U",p:375,w:0,no:"Att.1/day regain slot<=3rd"},
{n:"Headband of Intellect",r:"U",p:400,w:0,no:"Att.INT becomes 19"},{n:"Helm Comp.Languages",r:"U",p:300,w:0,no:"Comp.Languages at will"},
{n:"Helm of Telepathy",r:"U",p:375,w:0,no:"Att.Detect Thoughts,telepathy"},{n:"Bard(Doss)",r:"U",p:400,w:2,no:"Att(bard).Various spells"},
{n:"Bard(Fochlucan)",r:"U",p:375,w:2,no:"Att(bard).Various spells"},{n:"Bard(Mac-Fuirmidh)",r:"U",p:375,w:2,no:"Att(bard).Various spells"},
{n:"Medallion of Thoughts",r:"U",p:350,w:0,no:"3chg.Detect Thoughts"},{n:"Nature's Mantle",r:"U",p:350,w:1,no:"Att(druid/ranger).Focus+Hide"},
{n:"Enspelled Staff(2nd)",r:"R",p:1650,w:4,no:"Att.2nd lvl 6/day"},{n:"Enspelled Staff(3rd)",r:"R",p:1850,w:4,no:"Att.3rd lvl 6/day"},
{n:"Staff of Charming",r:"R",p:1750,w:4,no:"Att.10chg.Charm/Command"},{n:"Staff of Healing",r:"R",p:1800,w:4,no:"Att.10chg.Cure/Restore"},
{n:"Staff Swarming Insects",r:"R",p:1700,w:4,no:"Att.10chg.Insect spells"},{n:"Staff of Withering",r:"R",p:1750,w:4,no:"Att.3chg.2d10 necrotic"},
{n:"Staff of Woodlands",r:"R",p:1900,w:4,no:"Att(druid).6chg.Nature spells"},
{n:"Wand of Binding",r:"R",p:1700,w:0,no:"Att.7chg.Hold Person/Monster"},{n:"Wand Enemy Detection",r:"R",p:1600,w:0,no:"Att.7chg.Detect hostile"},
{n:"Wand of Fear",r:"R",p:1700,w:0,no:"Att.7chg.Command/Fear"},{n:"Wand of Fireballs",r:"R",p:2000,w:0,no:"Att.7chg.Fireball"},
{n:"Wand Lightning Bolts",r:"R",p:2000,w:0,no:"Att.7chg.Lightning Bolt"},{n:"Wand of Paralysis",r:"R",p:1800,w:0,no:"Att.7chg.Paralyze DC15"},
{n:"Wand of Wonder",r:"R",p:1600,w:0,no:"Att.7chg.Random effect"},{n:"Wand War Mage+2",r:"R",p:1800,w:0,no:"Att.+2 spell atk"},
{n:"Rod Pact Keeper+2",r:"R",p:1800,w:2,no:"Att(warlock).+2 atk/DC"},{n:"Rod of Rulership",r:"R",p:1750,w:2,no:"Att.Charm 120ft"},
{n:"Tentacle Rod",r:"R",p:1700,w:2,no:"Att.3 tentacle attacks"},{n:"Bard(Canaith)",r:"R",p:1750,w:2,no:"Att(bard).Various spells"},
{n:"Bard(Cli)",r:"R",p:1800,w:2,no:"Att(bard).Various spells"},
{n:"Enspelled Staff(4th)",r:"V",p:6000,w:4,no:"Att.4th lvl 6/day"},{n:"Enspelled Staff(5th)",r:"V",p:7000,w:4,no:"Att.5th lvl 6/day"},
{n:"Staff of Fire",r:"V",p:7000,w:4,no:"Att.10chg.Fire spells"},{n:"Staff of Frost",r:"V",p:7000,w:4,no:"Att.10chg.Cold spells"},
{n:"Staff of Power",r:"V",p:8000,w:4,no:"Att.+2 AC/saves.20chg"},{n:"Staff of Striking",r:"V",p:6500,w:4,no:"Att.10chg.+3d6 force"},
{n:"Staff Thunder&Lightning",r:"V",p:7000,w:4,no:"Att.Various lightning/thunder"},
{n:"Wand of Polymorph",r:"V",p:7000,w:0,no:"Att.7chg.Polymorph"},{n:"Wand War Mage+3",r:"V",p:6500,w:0,no:"Att.+3 spell atk"},
{n:"Rod of Absorption",r:"V",p:7000,w:2,no:"Att.Absorb spell energy"},{n:"Rod of Alertness",r:"V",p:6500,w:2,no:"Att.Adv init.Detect"},
{n:"Rod of Security",r:"V",p:6000,w:2,no:"Pocket paradise"},{n:"Rod Pact Keeper+3",r:"V",p:6500,w:2,no:"Att(warlock).+3 atk/DC"},
{n:"Bard(Anstruth)",r:"V",p:7000,w:2,no:"Att(bard).Powerful spells"},
{n:"Enspelled Staff(6th)",r:"L",p:42000,w:4,no:"Att.6th lvl 6/day"},{n:"Enspelled Staff(7th)",r:"L",p:45000,w:4,no:"Att.7th lvl 6/day"},
{n:"Enspelled Staff(8th)",r:"L",p:48000,w:4,no:"Att.8th lvl 6/day"},{n:"Staff of the Magi",r:"L",p:50000,w:4,no:"Att.50chg.Many high spells"},
{n:"Rod of Lordly Might",r:"L",p:45000,w:2,no:"Att.+3.Transform.Paralyze"},{n:"Rod of Resurrection",r:"L",p:50000,w:2,no:"Att.5chg.Resurrection"},
{n:"Bard(Ollamh)",r:"L",p:45000,w:2,no:"Att(bard).Most powerful spells"},
// Scrolls
{n:"Scroll:Fire Bolt",r:"C",p:30,w:0,no:"0.1d10 fire"},{n:"Scroll:Light",r:"C",p:30,w:0,no:"0.20ft 1hr"},{n:"Scroll:Mage Hand",r:"C",p:30,w:0,no:"0.Spectral hand"},
{n:"Scroll:Mending",r:"C",p:30,w:0,no:"0.Repair"},{n:"Scroll:Message",r:"C",p:30,w:0,no:"0.Whisper 120ft"},{n:"Scroll:Minor Illusion",r:"C",p:30,w:0,no:"0.Image/sound"},
{n:"Scroll:Prestidigitation",r:"C",p:30,w:0,no:"0.Minor trick"},{n:"Scroll:Ray of Frost",r:"C",p:30,w:0,no:"0.1d8 cold"},{n:"Scroll:Sacred Flame",r:"C",p:30,w:0,no:"0.1d8 radiant"},
{n:"Scroll:Shocking Grasp",r:"C",p:30,w:0,no:"0.1d8 lightning"},{n:"Scroll:Thaumaturgy",r:"C",p:30,w:0,no:"0.Divine wonder"},{n:"Scroll:Toll the Dead",r:"C",p:30,w:0,no:"0.1d8/1d12 necr"},
{n:"Scroll:Absorb Elements",r:"C",p:50,w:0,no:"1.React:resist+dmg"},{n:"Scroll:Bless",r:"C",p:50,w:0,no:"1.+1d4 atk/saves"},{n:"Scroll:Burning Hands",r:"C",p:50,w:0,no:"1.3d6 fire cone"},
{n:"Scroll:Charm Person",r:"C",p:50,w:0,no:"1.Charm,WIS save"},{n:"Scroll:Command",r:"C",p:50,w:0,no:"1.One-word,WIS"},{n:"Scroll:Comp.Languages",r:"C",p:50,w:0,no:"1.Understand all"},
{n:"Scroll:Cure Wounds",r:"C",p:50,w:0,no:"1.Heal 1d8+mod"},{n:"Scroll:Detect Magic",r:"C",p:50,w:0,no:"1.Sense magic 30ft"},{n:"Scroll:Disguise Self",r:"C",p:50,w:0,no:"1.Alter appearance"},
{n:"Scroll:Entangle",r:"C",p:50,w:0,no:"1.Restrain 20ft"},{n:"Scroll:Faerie Fire",r:"C",p:50,w:0,no:"1.Adv attacks"},{n:"Scroll:Feather Fall",r:"C",p:50,w:0,no:"1.React:slow fall"},
{n:"Scroll:Fog Cloud",r:"C",p:50,w:0,no:"1.Obscure 20ft"},{n:"Scroll:Goodberry",r:"C",p:50,w:0,no:"1.10 berries heal 1"},{n:"Scroll:Grease",r:"C",p:50,w:0,no:"1.DEX or prone"},
{n:"Scroll:Guiding Bolt",r:"C",p:50,w:0,no:"1.4d6 rad,adv next"},{n:"Scroll:Healing Word",r:"C",p:50,w:0,no:"1.BA:heal 2d4+mod"},{n:"Scroll:Identify",r:"C",p:50,w:0,no:"1.Item properties"},
{n:"Scroll:Mage Armor",r:"C",p:50,w:0,no:"1.AC 13+DEX 8hr"},{n:"Scroll:Magic Missile",r:"C",p:50,w:0,no:"1.3x1d4+1 force"},{n:"Scroll:Prot Evil/Good",r:"C",p:50,w:0,no:"1.Protect vs"},
{n:"Scroll:Sanctuary",r:"C",p:50,w:0,no:"1.WIS to target"},{n:"Scroll:Shield",r:"C",p:50,w:0,no:"1.React:+5 AC"},{n:"Scroll:Sleep",r:"C",p:50,w:0,no:"1.5d8 HP sleep"},
{n:"Scroll:Hideous Laughter",r:"C",p:50,w:0,no:"1.Prone+incapacitated"},{n:"Scroll:Thunderwave",r:"C",p:50,w:0,no:"1.2d8 thunder+push"},
{n:"Scroll:Aid",r:"U",p:100,w:0,no:"2.+5HP max 3 targets"},{n:"Scroll:Blur",r:"U",p:100,w:0,no:"2.Disadv vs you"},{n:"Scroll:Calm Emotions",r:"U",p:100,w:0,no:"2.Suppress charm/fright"},
{n:"Scroll:Darkness",r:"U",p:100,w:0,no:"2.Magical dark 15ft"},{n:"Scroll:Darkvision",r:"U",p:100,w:0,no:"2.DV 60ft 8hr"},{n:"Scroll:Detect Thoughts",r:"U",p:100,w:0,no:"2.Read surface thoughts"},
{n:"Scroll:Enhance Ability",r:"U",p:100,w:0,no:"2.Adv one ability"},{n:"Scroll:Enlarge/Reduce",r:"U",p:100,w:0,no:"2.Size change +/-1d4"},{n:"Scroll:Flaming Sphere",r:"U",p:100,w:0,no:"2.2d6 fire sphere"},
{n:"Scroll:Gust of Wind",r:"U",p:100,w:0,no:"2.60ft wind line"},{n:"Scroll:Heat Metal",r:"U",p:100,w:0,no:"2.2d8 fire on metal"},{n:"Scroll:Hold Person",r:"U",p:100,w:0,no:"2.Paralyze humanoid"},
{n:"Scroll:Invisibility",r:"U",p:100,w:0,no:"2.Invisible 1hr"},{n:"Scroll:Knock",r:"U",p:100,w:0,no:"2.Open lock.Loud"},{n:"Scroll:Lesser Resto",r:"U",p:100,w:0,no:"2.End condition"},
{n:"Scroll:Levitate",r:"U",p:100,w:0,no:"2.Rise 20ft"},{n:"Scroll:Mirror Image",r:"U",p:100,w:0,no:"2.3 duplicates"},{n:"Scroll:Misty Step",r:"U",p:100,w:0,no:"2.BA:teleport 30ft"},
{n:"Scroll:Pass w/o Trace",r:"U",p:100,w:0,no:"2.+10 Stealth party"},{n:"Scroll:Scorching Ray",r:"U",p:100,w:0,no:"2.3x2d6 fire"},{n:"Scroll:See Invisible",r:"U",p:100,w:0,no:"2.See invisible 1hr"},
{n:"Scroll:Shatter",r:"U",p:100,w:0,no:"2.3d8 thunder 10ft"},{n:"Scroll:Silence",r:"U",p:100,w:0,no:"2.No sound 20ft"},{n:"Scroll:Spiritual Weapon",r:"U",p:100,w:0,no:"2.1d8+mod force"},
{n:"Scroll:Suggestion",r:"U",p:100,w:0,no:"2.Suggest action"},{n:"Scroll:Warding Bond",r:"U",p:100,w:0,no:"2.+1 AC/saves,share dmg"},{n:"Scroll:Web",r:"U",p:100,w:0,no:"2.Restrain 20ft cube"},
{n:"Scroll:Bestow Curse",r:"U",p:150,w:0,no:"3.Curse target"},{n:"Scroll:Clairvoyance",r:"U",p:150,w:0,no:"3.See/hear remote"},{n:"Scroll:Counterspell",r:"U",p:150,w:0,no:"3.Negate spell"},
{n:"Scroll:Dispel Magic",r:"U",p:150,w:0,no:"3.End spell"},{n:"Scroll:Fear",r:"U",p:150,w:0,no:"3.Frighten 30ft cone"},{n:"Scroll:Fireball",r:"U",p:150,w:0,no:"3.8d6 fire 20ft"},
{n:"Scroll:Fly",r:"U",p:150,w:0,no:"3.Fly 60ft"},{n:"Scroll:Gaseous Form",r:"U",p:150,w:0,no:"3.Mist form"},{n:"Scroll:Haste",r:"U",p:150,w:0,no:"3.Speed+AC+action"},
{n:"Scroll:Hypnotic Pattern",r:"U",p:150,w:0,no:"3.Charm 30ft cube"},{n:"Scroll:Tiny Hut",r:"U",p:150,w:0,no:"3.Dome 10 creatures"},{n:"Scroll:Lightning Bolt",r:"U",p:150,w:0,no:"3.8d6 lightning line"},
{n:"Scroll:Major Image",r:"U",p:150,w:0,no:"3.Realistic illusion"},{n:"Scroll:Mass Healing Word",r:"U",p:150,w:0,no:"3.Heal 6 targets"},{n:"Scroll:Nondetection",r:"U",p:150,w:0,no:"3.Hidden from divination"},
{n:"Scroll:Prot Energy",r:"U",p:150,w:0,no:"3.Resist one element"},{n:"Scroll:Remove Curse",r:"U",p:150,w:0,no:"3.End curses"},{n:"Scroll:Revivify",r:"U",p:150,w:0,no:"3.Raise dead 1min"},
{n:"Scroll:Sending",r:"U",p:150,w:0,no:"3.25-word message"},{n:"Scroll:Sleet Storm",r:"U",p:150,w:0,no:"3.Difficult terrain"},{n:"Scroll:Slow",r:"U",p:150,w:0,no:"3.Halve speed"},
{n:"Scroll:Spirit Guardians",r:"U",p:150,w:0,no:"3.3d8 aura 15ft"},{n:"Scroll:Tongues",r:"U",p:150,w:0,no:"3.Speak any language"},{n:"Scroll:Water Breathing",r:"U",p:150,w:0,no:"3.10 creatures 24hr"},
{n:"Scroll:Arcane Eye",r:"R",p:250,w:0,no:"4.Invisible spy eye"},{n:"Scroll:Banishment",r:"R",p:250,w:0,no:"4.CHA save demiplane"},{n:"Scroll:Blight",r:"R",p:250,w:0,no:"4.8d8 necrotic"},
{n:"Scroll:Death Ward",r:"R",p:250,w:0,no:"4.Survive lethal once"},{n:"Scroll:Dimension Door",r:"R",p:250,w:0,no:"4.Teleport 500ft"},{n:"Scroll:Fabricate",r:"R",p:250,w:0,no:"4.Create finished goods"},
{n:"Scroll:Fire Shield",r:"R",p:250,w:0,no:"4.Resist+retaliate"},{n:"Scroll:Freedom Mvmt",r:"R",p:250,w:0,no:"4.Immune restrain"},{n:"Scroll:Greater Invis",r:"R",p:250,w:0,no:"4.Invis+attack"},
{n:"Scroll:Ice Storm",r:"R",p:250,w:0,no:"4.2d8+4d6 dmg"},{n:"Scroll:Locate Creature",r:"R",p:250,w:0,no:"4.Sense direction"},{n:"Scroll:Resilient Sphere",r:"R",p:250,w:0,no:"4.Force sphere trap"},
{n:"Scroll:Phantasmal Killer",r:"R",p:250,w:0,no:"4.4d10 psychic/turn"},{n:"Scroll:Polymorph",r:"R",p:250,w:0,no:"4.Transform to beast"},{n:"Scroll:Stoneskin",r:"R",p:250,w:0,no:"4.Resist B/P/S"},
{n:"Scroll:Wall of Fire",r:"R",p:250,w:0,no:"4.5d8 fire wall"},
{n:"Scroll:Animate Objects",r:"R",p:300,w:0,no:"5.Animate 10 objects"},{n:"Scroll:Bigby's Hand",r:"R",p:300,w:0,no:"5.Large force hand"},{n:"Scroll:Cloudkill",r:"R",p:300,w:0,no:"5.5d8 poison cloud"},
{n:"Scroll:Cone of Cold",r:"R",p:300,w:0,no:"5.8d8 cold 60ft cone"},{n:"Scroll:Dominate Person",r:"R",p:300,w:0,no:"5.Control humanoid"},{n:"Scroll:Flame Strike",r:"R",p:300,w:0,no:"5.4d6+4d6"},
{n:"Scroll:Greater Resto",r:"R",p:300,w:0,no:"5.End major conditions"},{n:"Scroll:Hold Monster",r:"R",p:300,w:0,no:"5.Paralyze any creature"},{n:"Scroll:Legend Lore",r:"R",p:300,w:0,no:"5.Learn lore"},
{n:"Scroll:Mass Cure Wounds",r:"R",p:300,w:0,no:"5.Heal 6 creatures"},{n:"Scroll:Planar Binding",r:"R",p:300,w:0,no:"5.Bind outsider"},{n:"Scroll:Raise Dead",r:"R",p:300,w:0,no:"5.Raise dead 10 days"},
{n:"Scroll:Scrying",r:"R",p:300,w:0,no:"5.See creature anywhere"},{n:"Scroll:Synaptic Static",r:"R",p:300,w:0,no:"5.8d6 psychic-1d6"},{n:"Scroll:Telekinesis",r:"R",p:300,w:0,no:"5.Move 1000lb"},
{n:"Scroll:Teleport Circle",r:"R",p:300,w:0,no:"5.Known circle"},{n:"Scroll:Wall of Force",r:"R",p:300,w:0,no:"5.Indestructible wall"},{n:"Scroll:Wall of Stone",r:"R",p:300,w:0,no:"5.Stone wall panels"},
{n:"Scroll of Protection",r:"R",p:275,w:0,no:"Choose creature type.Circle"},
{n:"Scroll Titan Summon",r:"L",p:2000,w:0,no:"Summon titan construct"},
];

// MAGIC ITEMS
const MI=[
{n:"Bead of Nourishment",r:"C",p:10,w:0,no:"Nourish 1 creature"},{n:"Bead of Refreshment",r:"C",p:10,w:0,no:"Purify 1 pint"},
{n:"Boots of False Tracks",r:"C",p:75,w:1,no:"Att.Fake footprints"},{n:"Charlatan's Die",r:"C",p:100,w:0,no:"Att.Choose die result"},
{n:"Cloak of Billowing",r:"C",p:75,w:1,no:"Dramatic billow as BA"},{n:"Cloak of Many Fashions",r:"C",p:75,w:1,no:"Change cloak appearance"},
{n:"Clockwork Amulet",r:"C",p:100,w:1,no:"1/day:flat 10 attack"},{n:"Clothes of Mending",r:"C",p:75,w:0,no:"Self-repairing clothes"},
{n:"Dread Helm",r:"C",p:75,w:1,no:"Eyes glow red"},{n:"Ear Horn of Hearing",r:"C",p:75,w:1,no:"Adv Perception(hearing)"},
{n:"Ersatz Eye",r:"C",p:100,w:0,no:"Att.Replace lost eye"},{n:"Hat of Vermin",r:"C",p:75,w:0,no:"3chg.Summon bat/frog/rat"},
{n:"Horn of Silent Alarm",r:"C",p:75,w:2,no:"Only 1 creature hears 600ft"},{n:"Lock of Trickery",r:"C",p:75,w:0,no:"Appears locked.DC30 pick"},
{n:"Mystery Key",r:"C",p:75,w:0,no:"5% any lock then vanishes"},{n:"Nightcap",r:"C",p:75,w:0,no:"Cast Message while wearing"},
{n:"Pipe Smoke Monsters",r:"C",p:75,w:0,no:"Blow smoke creature shapes"},{n:"Pole of Angling",r:"C",p:75,w:4,no:"Becomes fishing rod"},
{n:"Pole of Collapsing",r:"C",p:75,w:0,no:"10ft pole to 1ft"},{n:"Pot of Awakening",r:"C",p:75,w:10,no:"Awaken shrub in 30 days"},
{n:"Prosthetic Limb",r:"C",p:100,w:0,no:"Att.Replace lost limb"},{n:"Rival Coin",r:"C",p:75,w:0,no:"50/50 damage gamble"},
{n:"Rope of Mending",r:"C",p:75,w:3,no:"Rejoins when cut"},{n:"Talking Doll",r:"C",p:75,w:1,no:"Att.Record 6-sec message"},
{n:"Tankard of Sobriety",r:"C",p:75,w:1,no:"Never intoxicated"},{n:"Unbreakable Arrow",r:"C",p:75,w:0,no:"Cannot be broken"},
{n:"Alchemy Jug",r:"U",p:350,w:12,no:"Produce various liquids daily"},{n:"Amulet vs Detection",r:"U",p:375,w:1,no:"Att.Immune divination/scrying"},
{n:"Baba Yaga's Broom",r:"U",p:375,w:3,no:"Att.Animated broom attacks"},{n:"Bag of Holding",r:"U",p:400,w:15,no:"500lbs extradimensional space"},
{n:"Bag of Tricks(Gray)",r:"U",p:325,w:0.5,no:"Pull fuzzy=random beast"},{n:"Bag of Tricks(Rust)",r:"U",p:325,w:0.5,no:"Pull fuzzy=random beast"},
{n:"Bag of Tricks(Tan)",r:"U",p:325,w:0.5,no:"Pull fuzzy=random beast"},{n:"Boots of Elvenkind",r:"U",p:350,w:1,no:"Adv Stealth to move silently"},
{n:"Boots of Striding",r:"U",p:350,w:1,no:"Att.Speed 30 min,triple jump"},{n:"Boots of Winterlands",r:"U",p:325,w:1,no:"Att.Cold resist,walk ice"},
{n:"Bracers of Archery",r:"U",p:375,w:1,no:"Att.+2 ranged damage"},{n:"Brooch of Shielding",r:"U",p:375,w:0,no:"Att.Resist force,immune MM"},
{n:"Broom of Flying",r:"U",p:400,w:3,no:"Att.Fly 50ft"},{n:"Cap Water Breathing",r:"U",p:300,w:0,no:"Breathe underwater"},
{n:"Circlet of Blasting",r:"U",p:325,w:0,no:"1/day Scorching Ray"},{n:"Cloak of Elvenkind",r:"U",p:350,w:1,no:"Att.Disadv to spot you"},
{n:"Cloak of Protection",r:"U",p:400,w:1,no:"Att.+1 AC and saves"},{n:"Cloak Manta Ray",r:"U",p:325,w:1,no:"Att.Swim 60,breathe water"},
{n:"Decanter Endless Water",r:"U",p:350,w:2,no:"Produce 1-30 gal water"},{n:"Deck of Illusions",r:"U",p:300,w:0,no:"Card creates illusion"},
{n:"Driftglobe",r:"U",p:300,w:1,no:"Light or Daylight 1/day"},{n:"Eversmoking Bottle",r:"U",p:300,w:1,no:"Heavy obscure 60ft"},
{n:"Eyes of Charming",r:"U",p:350,w:0,no:"Att.3chg Charm Person"},{n:"Eyes Minute Seeing",r:"U",p:300,w:0,no:"Adv Investigation(sight)"},
{n:"Eyes of Eagle",r:"U",p:325,w:0,no:"Adv Perception(sight)"},{n:"Fig.(Silver Raven)",r:"U",p:325,w:0,no:"Becomes raven 12hr"},
{n:"Gauntlets Ogre Power",r:"U",p:400,w:1,no:"Att.STR becomes 19"},{n:"Gem of Brightness",r:"U",p:325,w:0,no:"50chg.Light/blind"},
{n:"Gloves Missile Snaring",r:"U",p:350,w:0,no:"Att.Reduce ranged 1d10+DEX"},{n:"Gloves Swim/Climb",r:"U",p:325,w:0,no:"Att.Swim/climb=walk"},
{n:"Gloves of Thievery",r:"U",p:350,w:0,no:"+5 Sleight of Hand"},{n:"Goggles of Night",r:"U",p:350,w:0,no:"Darkvision 60ft"},
{n:"Hag Eye",r:"U",p:300,w:0,no:"Darkvision or See Invisible"},{n:"Hat of Disguise",r:"U",p:350,w:0,no:"Att.Disguise Self at will"},
{n:"Lantern of Revealing",r:"U",p:325,w:2,no:"Reveal invisible 30ft"},{n:"Necklace Adaptation",r:"U",p:375,w:1,no:"Att.Breathe in any environment"},
{n:"Periapt of Health",r:"U",p:350,w:0,no:"Att.Immune to disease"},{n:"Periapt Wound Closure",r:"U",p:375,w:0,no:"Att.Stabilize,double heal dice"},
{n:"Pipes of Haunting",r:"U",p:325,w:2,no:"3chg.Frighten 30ft"},{n:"Pipes of Sewers",r:"U",p:300,w:2,no:"Att.Summon/control rats"},
{n:"Feather Token(Anchor)",r:"U",p:300,w:0,no:"Immobilize boat"},{n:"Feather Token(Fan)",r:"U",p:300,w:0,no:"Gust of wind"},
{n:"Feather Token(Tree)",r:"U",p:300,w:0,no:"Create oak tree"},{n:"Quiver of Ehlonna",r:"U",p:325,w:2,no:"Hold 60 arrows,18 javelins,6 staves"},
{n:"Ring of Jumping",r:"U",p:300,w:0,no:"Att.Triple jump distance"},{n:"Ring Mind Shielding",r:"U",p:350,w:0,no:"Att.Immune to mind reading"},
{n:"Ring of Swimming",r:"U",p:300,w:0,no:"Swim speed 40ft"},{n:"Ring of Warmth",r:"U",p:325,w:0,no:"Att.Cold resist,comfort to -50"},
{n:"Ring Water Walking",r:"U",p:325,w:0,no:"Walk on liquid surfaces"},{n:"Robe Useful Items",r:"U",p:325,w:4,no:"Detach patches=real items"},
{n:"Rope of Climbing",r:"U",p:300,w:3,no:"60ft,moves on command"},{n:"Saddle of Cavalier",r:"U",p:325,w:0,no:"Can't be dismounted"},
{n:"Sending Stones",r:"U",p:350,w:0,no:"Pair.Cast Sending 1/day"},{n:"Slippers Spider Climb",r:"U",p:375,w:0.5,no:"Att.Walk walls/ceilings"},
{n:"Stone of Good Luck",r:"U",p:400,w:0,no:"Att.+1 ability checks+saves"},{n:"Wind Fan",r:"U",p:325,w:0,no:"3chg.Gust of Wind"},
{n:"Winged Boots",r:"U",p:400,w:1,no:"Att.Fly=walk speed,4hr"},{n:"Wraps Unarmed+1",r:"U",p:350,w:0,no:"+1 unarmed attacks+damage"},
{n:"Amulet of Health",r:"R",p:2000,w:0,no:"Att.CON becomes 19"},{n:"Bag of Beans",r:"R",p:1500,w:2,no:"Random magical effects"},
{n:"Bead of Force",r:"R",p:1600,w:0,no:"5d4 force+sphere trap"},{n:"Belt of Dwarvenkind",r:"R",p:1800,w:1,no:"Att.CON+2,darkvision,poison resist"},
{n:"Belt Giant Str(Hill)",r:"R",p:2000,w:1,no:"Att.STR 21"},{n:"Boots of Levitation",r:"R",p:1700,w:1,no:"Att.Levitate at will"},
{n:"Boots of Speed",r:"R",p:1800,w:1,no:"Att.BA:double speed 10min"},{n:"Bowl Water Elem.",r:"R",p:1600,w:3,no:"Summon Water Elemental 1/day"},
{n:"Bracers of Defense",r:"R",p:2000,w:1,no:"Att.+2 AC if no armor/shield"},{n:"Brazier Fire Elem.",r:"R",p:1600,w:5,no:"Summon Fire Elemental 1/day"},
{n:"Cape of Mountebank",r:"R",p:1600,w:1,no:"1/day Dimension Door"},{n:"Censer Air Elem.",r:"R",p:1600,w:1,no:"Summon Air Elemental 1/day"},
{n:"Chime of Opening",r:"R",p:1500,w:1,no:"10chg.Open any lock/latch"},{n:"Cloak Displacement",r:"R",p:2000,w:1,no:"Att.Disadv attacks vs you until hit"},
{n:"Cloak of Bat",r:"R",p:1800,w:1,no:"Att.Adv Stealth,fly 40 in dark"},{n:"Cube of Force",r:"R",p:1800,w:1,no:"Att.10chg.Force barriers"},
{n:"Cube of Summoning",r:"R",p:1750,w:0,no:"Random summon spell"},{n:"Daern's Fortress",r:"R",p:1800,w:1,no:"Att.Adamantine tower"},
{n:"Dimensional Shackles",r:"R",p:1700,w:0,no:"Prevent extradimensional travel"},{n:"Fig.(Bronze Griffon)",r:"R",p:1600,w:0,no:"Griffon mount 6hr"},
{n:"Fig.(Ebony Fly)",r:"R",p:1600,w:0,no:"Giant Fly mount 12hr"},{n:"Fig.(Golden Lions)",r:"R",p:1700,w:0,no:"2 lions 1hr"},
{n:"Fig.(Ivory Goats)",r:"R",p:1750,w:0,no:"3 goats,various effects"},{n:"Fig.(Marble Elephant)",r:"R",p:1800,w:0,no:"Elephant 24hr"},
{n:"Fig.(Onyx Dog)",r:"R",p:1600,w:0,no:"Dog 6hr,darkvision 60"},{n:"Fig.(Serpentine Owl)",r:"R",p:1700,w:0,no:"Giant owl 8hr,telepathy"},
{n:"Folding Boat",r:"R",p:1600,w:4,no:"Box folds to boat/ship"},{n:"Gem of Seeing",r:"R",p:1800,w:0,no:"Att.3chg True Seeing 10min"},
{n:"Helm of Teleportation",r:"R",p:2000,w:3,no:"Att.3chg Teleport"},{n:"Heward's Haversack",r:"R",p:1700,w:5,no:"Organized Bag of Holding"},
{n:"Horn of Blasting",r:"R",p:1700,w:2,no:"5d6 thunder 30ft cone"},{n:"Horn Valhalla(Brass)",r:"R",p:1700,w:2,no:"Summon 3d4+3 berserkers"},
{n:"Horn Valhalla(Silver)",r:"R",p:1800,w:2,no:"Summon 4d4+4 berserkers"},{n:"Horseshoes Speed",r:"R",p:1600,w:0,no:"Mount +30ft speed"},
{n:"Ioun(Awareness)",r:"R",p:1800,w:0,no:"Att.Can't be surprised"},{n:"Ioun(Protection)",r:"R",p:1800,w:0,no:"Att.+1 AC"},
{n:"Ioun(Reserve)",r:"R",p:1700,w:0,no:"Att.Store spell up to 3rd"},{n:"Ioun(Sustenance)",r:"R",p:1600,w:0,no:"Att.No food/drink needed"},
{n:"Iron Bands Bilarro",r:"R",p:1700,w:1,no:"Restrain Large or smaller DC20"},{n:"Mantle Spell Resist",r:"R",p:2000,w:1,no:"Att.Adv on saves vs spells"},
{n:"Necklace Fireballs",r:"R",p:1800,w:1,no:"Multiple Fireballs"},{n:"Necklace Prayer Beads",r:"R",p:1900,w:1,no:"Att.Various heal/bless spells"},
{n:"Periapt vs Poison",r:"R",p:1700,w:0,no:"Att.Immune poison dmg+condition"},{n:"Portable Hole",r:"R",p:1800,w:0,no:"6ft extradimensional hole"},
{n:"Feather Token(Bird)",r:"R",p:275,w:0,no:"Bird delivers message"},{n:"Feather Token(Swan)",r:"R",p:300,w:0,no:"Swan boat 24hr"},
{n:"Feather Token(Whip)",r:"R",p:275,w:0,no:"+9 attack,1d6+5 force"},
{n:"Ring Animal Influence",r:"R",p:1600,w:0,no:"3chg.Animal Friend/Fear/Speak"},{n:"Ring of Evasion",r:"R",p:1800,w:0,no:"Att.3chg auto-succeed DEX save"},
{n:"Ring Feather Falling",r:"R",p:1700,w:0,no:"Att.Constant Feather Fall"},{n:"Ring Free Action",r:"R",p:1800,w:0,no:"Att.Immune paralyze/restrain"},
{n:"Ring of Protection",r:"R",p:2000,w:0,no:"Att.+1 AC and saves"},{n:"Ring of Resistance",r:"R",p:1700,w:0,no:"Resist one damage type"},
{n:"Ring Spell Storing",r:"R",p:2000,w:0,no:"Att.Store up to 5 spell levels"},{n:"Ring X-ray Vision",r:"R",p:1700,w:0,no:"Att.See through walls 30ft"},
{n:"Ring of the Ram",r:"R",p:1750,w:0,no:"Att.3chg.2d10 force+push"},{n:"Robe of Eyes",r:"R",p:1800,w:4,no:"Att.See all directions,DV120,see invis"},
{n:"Rope Entanglement",r:"R",p:1600,w:3,no:"Restrain target DC20"},{n:"Stone Earth Elem.",r:"R",p:1600,w:5,no:"Summon Earth Elemental 1/day"},
{n:"Wings of Flying",r:"R",p:2000,w:1,no:"Att.BA:fly 60ft 1hr"},{n:"Wraps Unarmed+2",r:"R",p:1700,w:0,no:"+2 unarmed attacks+damage"},
{n:"Amulet of Planes",r:"V",p:6500,w:0,no:"Att.Cast Plane Shift"},{n:"Bag of Devouring",r:"V",p:5500,w:0,no:"Extradimensional predator"},
{n:"Belt Giant Str(Fire)",r:"V",p:7000,w:1,no:"Att.STR 25"},{n:"Belt Giant Str(Frost)",r:"V",p:6500,w:1,no:"Att.STR 23"},
{n:"Belt Giant Str(Stone)",r:"V",p:6500,w:1,no:"Att.STR 23"},{n:"Candle Invocation",r:"V",p:7000,w:0,no:"Att.Gate+advantage aligned"},
{n:"Carpet of Flying",r:"V",p:7000,w:0,no:"Fly 30-80ft by size"},{n:"Cauldron Rebirth",r:"V",p:6500,w:0,no:"Att.Raise Dead 1/7days"},
{n:"Cloak Arachnida",r:"V",p:6500,w:1,no:"Att.Spider climb,web immune,poison resist"},
{n:"Crystal Ball",r:"V",p:7000,w:3,no:"Att.Scrying at will"},{n:"Efreeti Bottle",r:"V",p:6000,w:0,no:"Imprisoned Efreeti"},
{n:"Fig.(Obsidian Steed)",r:"V",p:6500,w:0,no:"Nightmare mount"},{n:"Hat Many Spells",r:"V",p:7500,w:0,no:"Att(wizard).Extra prepared"},
{n:"Helm of Brilliance",r:"V",p:7500,w:3,no:"Att.Gems cast fire/light"},{n:"Horn Valhalla(Bronze)",r:"V",p:6500,w:2,no:"Summon 5d4+5 berserkers"},
{n:"Horseshoes Zephyr",r:"V",p:6000,w:0,no:"Float above ground,no tracks"},
{n:"Ioun(Absorption)",r:"V",p:7000,w:0,no:"Att.Cancel spell,store"},{n:"Ioun(Agility)",r:"V",p:7000,w:0,no:"Att.DEX+2(max 22)"},
{n:"Ioun(Fortitude)",r:"V",p:7000,w:0,no:"Att.CON+2(max 22)"},{n:"Ioun(Insight)",r:"V",p:7000,w:0,no:"Att.WIS+2(max 22)"},
{n:"Ioun(Intellect)",r:"V",p:7000,w:0,no:"Att.INT+2(max 22)"},{n:"Ioun(Leadership)",r:"V",p:7000,w:0,no:"Att.CHA+2(max 22)"},
{n:"Ioun(Strength)",r:"V",p:7000,w:0,no:"Att.STR+2(max 22)"},
{n:"Manual Bodily Health",r:"V",p:8000,w:5,no:"CON+2 permanently"},{n:"Manual Gainful Exercise",r:"V",p:8000,w:5,no:"STR+2 permanently"},
{n:"Manual Golems(Clay)",r:"V",p:6000,w:5,no:"Create Clay Golem"},{n:"Manual Golems(Flesh)",r:"V",p:5500,w:5,no:"Create Flesh Golem"},
{n:"Manual Golems(Iron)",r:"V",p:7000,w:5,no:"Create Iron Golem"},{n:"Manual Golems(Stone)",r:"V",p:6500,w:5,no:"Create Stone Golem"},
{n:"Manual Quickness",r:"V",p:8000,w:5,no:"DEX+2 permanently"},{n:"Mirror Life Trapping",r:"V",p:6500,w:50,no:"Trap creatures in mirror"},
{n:"Nolzur's Pigments",r:"V",p:6000,w:0,no:"Paint becomes real"},{n:"Robe Scintillating",r:"V",p:6500,w:4,no:"Att.Stun/blind aura"},
{n:"Robe of Stars",r:"V",p:7000,w:4,no:"Att.+1 saves.MM.Astral"},{n:"Spirit Board",r:"V",p:5500,w:2,no:"Commune with spirits"},
{n:"Tome Clear Thought",r:"V",p:8000,w:5,no:"INT+2 permanently"},{n:"Tome Leadership",r:"V",p:8000,w:5,no:"CHA+2 permanently"},
{n:"Tome Understanding",r:"V",p:8000,w:5,no:"WIS+2 permanently"},{n:"Wraps Unarmed+3",r:"V",p:6000,w:0,no:"+3 unarmed attacks+damage"},
{n:"Ring Regeneration",r:"V",p:7000,w:0,no:"Att.1d6HP/10min.Regrow limbs"},{n:"Ring Shooting Stars",r:"V",p:6500,w:0,no:"Att.Lights,faerie fire,lightning"},
{n:"Ring Telekinesis",r:"V",p:7000,w:0,no:"Att.Telekinesis at will"},
{n:"Apparatus of Kwalish",r:"L",p:40000,w:500,no:"Lobster submersible"},{n:"Belt Giant Str(Cloud)",r:"L",p:45000,w:1,no:"Att.STR 27"},
{n:"Belt Giant Str(Storm)",r:"L",p:50000,w:1,no:"Att.STR 29"},{n:"Cloak Invisibility",r:"L",p:50000,w:1,no:"Att.Invisible at will"},
{n:"Crystal Ball Mind Read",r:"L",p:48000,w:3,no:"Att.Scry+Detect Thoughts"},{n:"Crystal Ball Telepathy",r:"L",p:48000,w:3,no:"Att.Scry+Suggestion"},
{n:"Crystal Ball True See",r:"L",p:50000,w:3,no:"Att.Scry+True Seeing"},{n:"Cubic Gate",r:"L",p:45000,w:0,no:"Open gates to 6 planes"},
{n:"Deck of Many Things",r:"L",p:50000,w:0,no:"Fate-altering cards"},{n:"Horn Valhalla(Iron)",r:"L",p:42000,w:2,no:"Summon 6d4+6 berserkers"},
{n:"Ioun(Greater Absorb)",r:"L",p:45000,w:0,no:"Att.Cancel+store more"},{n:"Ioun(Mastery)",r:"L",p:50000,w:0,no:"Att.Prof bonus+1"},
{n:"Ioun(Regeneration)",r:"L",p:45000,w:0,no:"Att.Regain 15HP/hr"},{n:"Iron Flask",r:"L",p:45000,w:1,no:"Trap extraplanar creature"},
{n:"Robe of Archmagi",r:"L",p:50000,w:4,no:"Att.AC15+Dex,adv saves,+2 DC"},{n:"Scarab Protection",r:"L",p:48000,w:0,no:"Att.Adv vs spells.12chg necr"},
{n:"Sovereign Glue",r:"L",p:40000,w:0,no:"Permanent adhesive"},{n:"Sphere Annihilation",r:"L",p:50000,w:0,no:"Destroy all matter"},
{n:"Talisman Pure Good",r:"L",p:45000,w:0,no:"Att.7chg.Destroy fiend/undead"},{n:"Talisman Ultimate Evil",r:"L",p:45000,w:0,no:"Att.6chg.Destroy good"},
{n:"Talisman of Sphere",r:"L",p:42000,w:0,no:"Att.Control Sphere of Annihilation"},{n:"Tome Stilled Tongue",r:"L",p:48000,w:5,no:"Att(wizard).+2 DC.Necromancy"},
{n:"Universal Solvent",r:"L",p:40000,w:0,no:"Dissolve anything"},{n:"Well of Many Worlds",r:"L",p:50000,w:0,no:"Portal to random plane"},
{n:"Ring Djinni Summon",r:"L",p:50000,w:0,no:"Att.Summon Djinni"},{n:"Ring Elem.Cmd(Air)",r:"L",p:45000,w:0,no:"Att.Control air elementals"},
{n:"Ring Elem.Cmd(Earth)",r:"L",p:45000,w:0,no:"Att.Control earth elementals"},{n:"Ring Elem.Cmd(Fire)",r:"L",p:45000,w:0,no:"Att.Control fire elementals"},
{n:"Ring Elem.Cmd(Water)",r:"L",p:45000,w:0,no:"Att.Control water elementals"},{n:"Ring of Invisibility",r:"L",p:50000,w:0,no:"Att.Invisible at will"},
{n:"Ring Spell Turning",r:"L",p:48000,w:0,no:"Att.Adv saves.Reflect spells"},{n:"Ring Three Wishes",r:"L",p:50000,w:0,no:"3 Wishes"},
];

// === SHOP DATA POOLS ===
const POOLS={blacksmith:[...W,...ARM],alchemy:AL,arcane:ARC,magic:MI};

// === DICE TABLES: [formula, min, max] ===
const DT={
blacksmith:{
  frontier:{M:["3d4",3,12],C:["1d2",1,2],U:["1d4-2",0,2],R:["1d10-9",0,1],V:null,L:null},
  established:{M:["4d4",4,16],C:["2d4",2,8],U:["1d6+2",3,8],R:["1d4",1,4],V:["1d4-3",0,1],L:null},
  hub:{M:["4d6",4,24],C:["3d4",3,12],U:["1d6+4",5,10],R:["1d4+2",3,6],V:["1d4-1",0,3],L:["1d20-19",0,1]},
  free:{M:["2d4",2,8],C:["1d6",1,6],U:["1d6",1,6],R:["1d6-2",0,4],V:["1d6-5",0,1],L:["1d10-9",0,1]}
},
alchemy:{
  frontier:{M:["1d4",1,4],C:["1d4+1",2,5],U:["1d3-1",0,2],R:null,V:null,L:null},
  established:{M:["1d6",1,6],C:["2d6+1",3,13],U:["1d6+2",3,8],R:["1d4-1",0,3],V:["1d6-5",0,1],L:null},
  hub:{M:["2d4",2,8],C:["2d6+3",5,15],U:["1d8+3",4,11],R:["1d4+1",2,5],V:["1d4-2",0,2],L:["1d20-19",0,1]},
  free:{M:["1d4+1",2,5],C:["1d6+1",2,7],U:["1d8",1,8],R:["1d4-2",0,2],V:["1d8-7",0,1],L:null}
},
arcane:{
  frontier:{M:["1d4+1",2,5],C:["1d4",1,4],U:["1d4-2",0,2],R:null,V:null,L:null},
  established:{M:["2d4",2,8],C:["2d4+2",4,10],U:["1d6+2",3,8],R:["1d4-1",0,3],V:["1d6-5",0,1],L:null},
  hub:{M:["2d6",2,12],C:["2d6+3",5,15],U:["3d4+1",4,13],R:["1d4+1",2,5],V:["1d3-1",0,2],L:["1d20-19",0,1]},
  free:{M:["1d4",1,4],C:["1d6+1",2,7],U:["1d6",1,6],R:["1d4-1",0,3],V:["1d8-7",0,1],L:["1d12-11",0,1]}
},
magic:{
  frontier:null,
  established:{M:null,C:["2d6",2,12],U:["1d6+1",2,7],R:["1d4",1,4],V:["1d4-3",0,1],L:null},
  hub:{M:null,C:["2d6+2",4,14],U:["1d8+3",4,11],R:["1d4+2",3,6],V:["1d4-1",0,3],L:["1d20-19",0,1]},
  free:{M:null,C:["1d6",1,6],U:["1d4+1",2,5],R:["1d4",1,4],V:["1d4-3",0,1],L:["1d10-9",0,1]}
}};

// === NAME GENERATOR ===
const NM={
blacksmith:{adj:["Iron","Steel","Blazing","Crimson","Heavy","Sturdy","Red","Tempered","Molten","Bright","Dark","Burnished","Golden","Silver","Scarred"],noun:["Forge","Anvil","Hammer","Blade","Arms","Shield","Edge","Ironworks","Armory","Steel"]},
alchemy:{adj:["Bubbling","Green","Bitter","Mystic","Boiling","Fragrant","Emerald","Smoky","Twisted","Ancient","Crystal","Violet","Amber","Crimson","Pungent"],noun:["Cauldron","Flask","Elixir","Remedy","Brew","Vial","Tincture","Apothecary","Potion","Draught"]},
arcane:{adj:["Dusty","Arcane","Whispering","Gilded","Faded","Enchanted","Learned","Silent","Moonlit","Starlit","Ancient","Runed","Cryptic","Sapphire","Amber"],noun:["Quill","Scroll","Tome","Page","Inkwell","Codex","Script","Grimoire","Archive","Library"]},
magic:{adj:["Curious","Enchanted","Peculiar","Wandering","Hidden","Strange","Wondrous","Mystical","Forgotten","Midnight","Twilight","Spectral","Phantom","Ethereal","Cosmic"],noun:["Oddities","Wonders","Curiosities","Trinkets","Emporium","Relics","Treasures","Marvels","Artifacts","Bazaar"]}
};
const FNAMES=["Durgan","Vessa","Pello","Ortho","Kael","Thessa","Rovik","Mira","Gundren","Sylara","Thorn","Brynn","Halvek","Nessa","Jorik","Elda","Fenwick","Corra","Bram","Liora","Zara","Orik","Talia","Dorn","Sable","Rylan","Maelis","Torvin","Asha","Garret"];

function genName(shop){
  const s=NM[shop],rnd=a=>a[Math.floor(Math.random()*a.length)];
  const patterns=[
    ()=>`${rnd(FNAMES)}'s ${rnd(s.noun)}`,
    ()=>`The ${rnd(s.adj)} ${rnd(s.noun)}`,
    ()=>`${rnd(s.adj)} ${rnd(s.noun)} & ${rnd(s.noun)}`,
    ()=>`The ${rnd(FNAMES)} ${rnd(s.noun)}`
  ];
  return rnd(patterns)();
}

// === RANDOM PICK ===
function pickRandom(arr,count){
  if(count<=0)return[];
  const shuffled=[...arr].sort(()=>Math.random()-0.5);
  return shuffled.slice(0,Math.min(count,arr.length));
}

// === DICE ROLL SIM ===
function rollDice(formula){
  const m=formula.match(/(\d+)d(\d+)([+-]\d+)?/);
  if(!m)return 0;
  const[,num,sides,mod]=m;
  let total=0;
  for(let i=0;i<parseInt(num);i++)total+=Math.floor(Math.random()*parseInt(sides))+1;
  if(mod)total+=parseInt(mod);
  return Math.max(0,total);
}

function fp(g,mod){
  const v=Math.round(g*mod);
  if(v>=1)return`${v.toLocaleString()} gp`;
  const sp=Math.round(g*mod*10);
  if(sp>=1)return`${sp} sp`;
  return`${Math.round(g*mod*100)} cp`;
}

const RARITIES=["M","C","U","R","V","L"];
const SHOPS=[{k:"blacksmith",l:"Blacksmith"},{k:"alchemy",l:"Alchemy Shop"},{k:"arcane",l:"Arcane Supplies"},{k:"magic",l:"Magic Item Shop"}];
const SETTLEMENTS=[{k:"frontier",l:"Frontier Settlement"},{k:"established",l:"Established Port"},{k:"hub",l:"Hub Capital"},{k:"free",l:"Free Seas"}];
const MODS=[{k:0.7,l:"-30%"},{k:0.8,l:"-20%"},{k:0.9,l:"-10%"},{k:1,l:"Base"},{k:1.1,l:"+10%"},{k:1.2,l:"+20%"},{k:1.3,l:"+30%"}];

export default function App(){
  const[shop,setShop]=useState("blacksmith");
  const[settle,setSettle]=useState("established");
  const[mod,setMod]=useState(1);
  const[rolls,setRolls]=useState({});
  const[result,setResult]=useState(null);
  const[shopName,setShopName]=useState("");
  const[bgImg,setBgImg]=useState(null);
  const[copied,setCopied]=useState("");
  const fileRef=useRef();

  const dt=DT[shop];
  const isBlocked=shop==="magic"&&settle==="frontier";
  const tbl=dt&&!isBlocked?dt[settle]:null;

  const activeRarities=useMemo(()=>{
    if(!tbl)return[];
    return RARITIES.filter(r=>tbl[r]&&tbl[r][2]>0);
  },[tbl]);

  const handleAutoRoll=()=>{
    if(!tbl)return;
    const nr={};
    activeRarities.forEach(r=>{
      const d=tbl[r];
      if(d)nr[r]=rollDice(d[0]);
    });
    setRolls(nr);
  };

  const handleGenerate=()=>{
    const pool=POOLS[shop];
    const items=[];
    activeRarities.forEach(r=>{
      const count=rolls[r]||0;
      if(count<=0)return;
      const available=pool.filter(i=>i.r===r);
      const picked=pickRandom(available,count);
      items.push(...picked.map(i=>({...i,_rarity:r})));
    });
    setResult(items);
    setShopName(genName(shop));
  };

  const handleRegenerate=()=>{
    const pool=POOLS[shop];
    const items=[];
    activeRarities.forEach(r=>{
      const count=rolls[r]||0;
      if(count<=0)return;
      const available=pool.filter(i=>i.r===r);
      items.push(...pickRandom(available,count).map(i=>({...i,_rarity:r})));
    });
    setResult(items);
  };

  const handleBg=(e)=>{
    const f=e.target.files[0];
    if(f){const r=new FileReader();r.onload=ev=>{setBgImg(ev.target.result);e.target.value="";};r.readAsDataURL(f);}
  };

  const allFilled=activeRarities.every(r=>rolls[r]!==undefined&&rolls[r]!=="");
  const modLabel=MODS.find(m=>m.k===mod)?.l||"Base";
  const shopLabel=SHOPS.find(s=>s.k===shop)?.l;
  const settleLabel=SETTLEMENTS.find(s=>s.k===settle)?.l;

  const buildText=(md)=>{
    if(!result)return"";
    const h=md?`## ${shopName}`:shopName;
    const sub=`${shopLabel} | ${settleLabel} | ${modLabel}`;
    let txt=md?`${h}\n*${sub}*\n\n`:`${h}\n${sub}\n\n`;
    let num=1;
    const grouped={};
    result.forEach(i=>{if(!grouped[i._rarity])grouped[i._rarity]=[];grouped[i._rarity].push(i);});
    RARITIES.forEach(r=>{
      if(!grouped[r])return;
      const label=RL[r].toUpperCase();
      txt+=md?`### ${label}\n`:`${label}\n`;
      grouped[r].forEach(i=>{
        const price=fp(i.p,mod);
        const detail=i.d?`${i.d} | ${i.pr||""}`:i.no||"";
        txt+=md?`${num}. **${i.n}** — ${price} — ${detail}\n`:`${num}. ${i.n} - ${price} - ${detail}\n`;
        num++;
      });
      txt+="\n";
    });
    return txt.trim();
  };

  const copyTo=(md)=>{
    navigator.clipboard.writeText(buildText(md));
    setCopied(md?"md":"txt");
    setTimeout(()=>setCopied(""),2000);
  };

  const s={fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:16};
  const btn=(active)=>({padding:"8px 16px",borderRadius:6,border:active?"2px solid #5b6abf":"1px solid #ccc",background:active?"#5b6abf":"transparent",color:active?"#fff":"#444",cursor:"pointer",fontSize:13,fontWeight:active?600:400});
  const sec={marginBottom:20};
  const lbl={fontSize:12,fontWeight:600,color:"var(--text-secondary,#666)",marginBottom:6,display:"block"};

  return(<div style={s}>
    <h2 style={{margin:"0 0 16px",color:"var(--text-primary,#222)"}}>D&D Shop Generator</h2>

    {/* CONFIG */}
    <div style={sec}>
      <span style={lbl}>Shop Type</span>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{SHOPS.map(sh=><button key={sh.k} onClick={()=>{setShop(sh.k);setRolls({});setResult(null)}} style={btn(shop===sh.k)}>{sh.l}</button>)}</div>
    </div>

    <div style={sec}>
      <span style={lbl}>Settlement</span>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{SETTLEMENTS.map(st=><button key={st.k} onClick={()=>{setSettle(st.k);setRolls({});setResult(null)}} style={btn(settle===st.k)}>{st.l}</button>)}</div>
    </div>

    <div style={sec}>
      <span style={lbl}>Price Modifier</span>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{MODS.map(m=><button key={m.k} onClick={()=>{setMod(m.k);if(result)setResult([...result])}} style={btn(mod===m.k)}>{m.l}</button>)}</div>
    </div>

    {/* BLOCKED */}
    {isBlocked&&<div style={{padding:16,background:"var(--bg-secondary,#f5f5f5)",borderRadius:8,color:"var(--text-secondary,#666)",fontSize:14,textAlign:"center"}}>No magic item shops exist at Frontier settlements.</div>}

    {/* DICE PANEL */}
    {tbl&&!isBlocked&&<div style={{...sec,background:"var(--bg-secondary,#f8f8f8)",borderRadius:8,padding:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{...lbl,margin:0}}>Dice Rolls — Enter Final Item Count</span>
        <button onClick={handleAutoRoll} style={{padding:"6px 12px",borderRadius:6,border:"1px solid var(--border-color,#ccc)",background:"transparent",color:"var(--accent,#5b6abf)",cursor:"pointer",fontSize:12}}>Roll For Me</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {activeRarities.map(r=>{const d=tbl[r];return(
          <div key={r} style={{background:"var(--bg-primary,#fff)",borderRadius:6,padding:10,border:"1px solid var(--border-color,#eee)"}}>
            <div style={{fontSize:12,fontWeight:600,color:RCL[r],marginBottom:4}}>{RL[r]}</div>
            <div style={{fontSize:11,color:"var(--text-secondary,#888)",marginBottom:6}}>{d[0]} ({d[1]}-{d[2]})</div>
            <input type="number" min={d[1]} max={d[2]} value={rolls[r]??""}
              onChange={e=>{const v=e.target.value;setRolls(p=>({...p,[r]:v===""?"":Math.min(d[2],Math.max(d[1],parseInt(v)||0))}))}}
              style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid var(--border-color,#ddd)",fontSize:14,boxSizing:"border-box",background:"var(--bg-primary,#fff)",color:"var(--text-primary,#222)"}}/>
          </div>
        )})}
      </div>
      <div style={{marginTop:12,display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={handleGenerate} disabled={!allFilled} style={{padding:"10px 20px",borderRadius:6,border:"none",background:allFilled?"#5b6abf":"#ccc",color:"#fff",cursor:allFilled?"pointer":"not-allowed",fontSize:14,fontWeight:600}}>Generate Shop</button>
        <button onClick={()=>fileRef.current?.click()} style={{padding:"6px 12px",borderRadius:6,border:"1px solid var(--border-color,#ccc)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--text-primary,#666)"}}>Upload Background</button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleBg} style={{display:"none"}}/>
        {bgImg&&<button onClick={()=>setBgImg(null)} style={{fontSize:11,color:"var(--text-secondary,#888)",background:"none",border:"none",cursor:"pointer"}}>Remove BG</button>}
      </div>
    </div>}

    {/* RESULT */}
    {result&&<div style={{borderRadius:8,overflow:"hidden",marginTop:16,position:"relative"}}>
      {bgImg&&<img src={bgImg} alt="" style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.45,zIndex:0,pointerEvents:"none"}}/>}
      <div style={{position:"relative",zIndex:1,padding:20,backgroundColor:bgImg?"rgba(255,255,255,0.55)":"transparent"}}>
        {/* Shop Name */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <h3 style={{margin:0,fontSize:22,color:"var(--text-primary,#222)"}}>{shopName}</h3>
          <button onClick={()=>setShopName(genName(shop))} title="Re-roll name" style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:2}}>&#x1f3b2;</button>
        </div>
        <div style={{fontSize:12,color:"var(--text-secondary,#888)",marginBottom:16}}>{shopLabel} | {settleLabel} | {modLabel}</div>

        {/* Items grouped by rarity */}
        {(()=>{
          const grouped={};result.forEach(i=>{if(!grouped[i._rarity])grouped[i._rarity]=[];grouped[i._rarity].push(i);});
          let num=1;
          return RARITIES.map(r=>{
            if(!grouped[r])return null;
            const poolSize=POOLS[shop].filter(x=>x.r===r).length;
            const requested=rolls[r]||0;
            return(<div key={r} style={{marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,color:RCL[r],marginBottom:6,borderBottom:`2px solid ${RCL[r]}`,paddingBottom:4}}>{RL[r].toUpperCase()}{requested>poolSize?` (only ${poolSize} available of ${requested} requested)`:""}</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead><tr>
                  <th style={{textAlign:"left",padding:"4px 8px",fontSize:11,color:"var(--text-secondary,#888)"}}>#</th>
                  <th style={{textAlign:"left",padding:"4px 8px",fontSize:11,color:"var(--text-secondary,#888)"}}>Item</th>
                  <th style={{textAlign:"left",padding:"4px 8px",fontSize:11,color:"var(--text-secondary,#888)"}}>Price</th>
                  <th style={{textAlign:"left",padding:"4px 8px",fontSize:11,color:"var(--text-secondary,#888)"}}>Details</th>
                </tr></thead>
                <tbody>{grouped[r].map((item,idx)=>{
                  const thisNum=num++;
                  return(<tr key={idx} style={{background:idx%2===0?"transparent":"var(--bg-secondary,rgba(0,0,0,0.03))"}}>
                    <td style={{padding:"4px 8px",color:"var(--text-secondary,#888)",fontSize:12}}>{thisNum}</td>
                    <td style={{padding:"4px 8px",fontWeight:500,color:"var(--text-primary,#222)"}}>{item.n}</td>
                    <td style={{padding:"4px 8px",color:"var(--text-primary,#333)",whiteSpace:"nowrap"}}>{fp(item.p,mod)}</td>
                    <td style={{padding:"4px 8px",color:"var(--text-secondary,#666)",fontSize:12}}>{item.d?`${item.d} | ${item.pr||""}`:item.no||""}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>);
          });
        })()}

        {/* Summary + Actions */}
        <div style={{borderTop:"1px solid var(--border-color,#ddd)",paddingTop:12,marginTop:8,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:12,color:"var(--text-secondary,#888)"}}>{result.length} items total</span>
          <button onClick={handleRegenerate} style={{padding:"6px 12px",borderRadius:6,border:"1px solid var(--border-color,#ccc)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--text-primary,#555)"}}>Regenerate Items</button>
          <button onClick={()=>{setResult(null);setRolls({})}} style={{padding:"6px 12px",borderRadius:6,border:"1px solid var(--border-color,#ccc)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--text-primary,#555)"}}>New Shop</button>
          <button onClick={()=>copyTo(false)} style={{padding:"6px 12px",borderRadius:6,border:"1px solid var(--border-color,#ccc)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--text-primary,#555)"}}>{copied==="txt"?"Copied!":"Copy (Text)"}</button>
          <button onClick={()=>copyTo(true)} style={{padding:"6px 12px",borderRadius:6,border:"1px solid var(--border-color,#ccc)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--text-primary,#555)"}}>{copied==="md"?"Copied!":"Copy (Markdown)"}</button>
        </div>
      </div>
    </div>}
  </div>);
}
