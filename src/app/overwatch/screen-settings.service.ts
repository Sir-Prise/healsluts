import { Injectable } from '@angular/core';
import { ScreenPoint } from '../model/screen-point.model';
import { Screen } from '../model/screen.model';
import { PositionUtils } from '../utils/position-utils';
import { OverwatchScreenName } from './screen-names';

// Colors
const MENUES_ADD_FRIEND_BTN_BG = {r: 50, g: 159, b: 231, a: 0.92};
const MENUES_FIND_GROUP_BTN_BG = {r: 249, g: 207, b: 43, a: 0.93};
const MENUS_USER_BOX_BG = {r: 40, g: 50, b: 75, a: 0.8};
const MENUES_AVATAR_BAR = {r: 131, g: 255, b: 12, a: 1};
const ALERT_POPUP_BG = {r: 23, g: 23, b: 33, a: 0.85};
const ALERT_POPUP_TEXT_BG = {r: 37, g: 46, b: 66, a: 0.96};
const ALERT_POPUP_ACTIONS_BG = {r: 35, g: 32, b: 36, a: 1};
const LOADING_MAP_OVERWATCH_LOGO = {r: 219, g: 253, b: 294, a: 0.67};
const LOADING_MAP_TIP_BG = {r: 42, g: 51, b: 78, a: 0.9};
const HERO_SELECTION_SKIN_BG = {r: 36, g: 120, b: 184, a: 0.49};
const HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG = {r: 188, g: 247, b: 255, a: 0.76};
const HERO_SELECTION_HORIZONTAL_LINE = {r: 238, g: 234, b: 255, a: 0.44};
const MATCH_HEALTH_BAR_FILLED = {r: 255, g: 255, b: 255, a: 0.84};
const MATCH_HEALTH_BAR_EMPTY = {r: 255, g: 255, b: 255, a: 0.37};
const MATCH_ON_FIRE_EMPTY = {r: 255, g: 255, b: 255, a: 0.25};
const MATCH_DEAD_BLOOD_UL = {r: 215, g: 0, b: 5, a: 0.5};
const MATCH_DEAD_BLOOD_LR = {r: 215, g: 0, b: 5, a: 0.7};
const KILLCAM_WHITE_BORDER_BOTTOM = {r: 255, g: 255, b: 255, a: 0.22};
const KILLCAM_WHITE_BORDER_COUNTDOWN = {r: 255, g: 255, b: 255, a: 0.34};
const KILLCAM_DARK_OVERLAY_BOTTOM = {r: 0, g: 0, b: 0, a: 0.78};
const KILLCAM_DARK_GLBOAL_OVERLAY = {r: 0, g: 0, b: 0, a: 0.14};
const SPECTATE_RESPAWN_COUNTDOWN_BORDER = {r: 255, g: 255, b: 255, a: 1};
const SCORE_BOARD_TOP_BOTTOM_BG = {r: 0, g: 0, b: 0, a: 0.95};
const SCORE_BOARD_GLOBAL_OVERLAY = {r: 0, g: 0, b: 0, a: 0.79};
const SCORE_BOARD_LINES = {r: 255, g: 255, b: 255, a: 0.2};
const SCORE_BOARD_MODE_LINES = {r: 255, g: 255, b: 255, a: 0.27};
const INTERACTION_MENU_OUTER_CIRCLE = {r: 255, g: 255, b: 255, a: 1};
const INTERACTION_MENU_OVERLAY = {r: 0, g: 0, b: 0, a: 0.73};
const BLACK = {r: 0, g: 0, b: 0, a: 1};

const DARK_OVERLAY_TOP_BORDER = {r: 255, g: 255, b: 255, a: 0.2};
const DARK_OVERLAY_TOP_BG = {r: 0, g: 0, b: 0, a: 0.36};
const IN_GAME_RETICLE_BG = {r: 255, g: 255, b: 255, a: 0.79};
const IN_GAME_RETICLE_BORDER = {r: 0, g: 0, b: 0, a: 0.34};
const IN_GAME_ON_FIRE_ICON = {r: 255, g: 255, b: 255, a: 0.85};
const IN_GAME_ON_FIRE_MAX_MARKER = {r: 255, g: 255, b: 255, a: 0.79};

// Common color positions
const DARK_OVERLAY_TOP = [
    {name: 'dark overlay top bg ul', x: 200, y: 123, color: DARK_OVERLAY_TOP_BG, contrast: {x: 200, y: 130}},
    {name: 'dark overlay top border ul', x: 200, y: 126, color: DARK_OVERLAY_TOP_BORDER, contrast: {x: 200, y: 123}},
    {name: 'dark overlay top bg ur', x: 1800, y: 25, color: DARK_OVERLAY_TOP_BG, contrast: {x: 1800, y: 127}},
    {name: 'dark overlay top border ur', x: 1800, y: 127, color: DARK_OVERLAY_TOP_BORDER, contrast: {x: 1800, y: 130}},
];
const IN_GAME_RETICLE = [
    // Currently, browsers always capture the cursor which overlays the reticle, so I picked a visible corner, not the center
    {name: 'reticle bg', x: 957, y: 539, color: IN_GAME_RETICLE_BG},
    {name: 'reticle border', x: 962, y: 537, color: IN_GAME_RETICLE_BORDER},
];
const IN_GAME_ON_FIRE_ICONS = [
    {name: 'on fire icon', x: 257, y: 997, color: IN_GAME_ON_FIRE_ICON},
    {name: 'on fire max marker', x: 432, y: 996, color: IN_GAME_ON_FIRE_MAX_MARKER},
];

// Default "max duration" for all screens which usually aren't visible for very long but theoretically it's possible to see them longer
const MAX_DURATION_SANE = 10_000;

// Types
type ScreensModel<T extends string> = Record<T, Screen<T>>;

const screens: ScreensModel<OverwatchScreenName> = {
    menues: {
        name: 'menues',
        must: [
            {name: 'add friend button ul', x: 1454, y: 39, color: MENUES_ADD_FRIEND_BTN_BG},
            {name: 'add friend button lr', x: 1494, y: 80, color: MENUES_ADD_FRIEND_BTN_BG},
            {name: 'find group button ur', x: 1430, y: 40, color: MENUES_FIND_GROUP_BTN_BG},
            {name: 'find group button ll', x: 1390, y: 80, color: MENUES_FIND_GROUP_BTN_BG},
            {name: 'user box bg ul', x: 1590, y: 40, color: MENUS_USER_BOX_BG},
            {name: 'user box bg lr', x: 1850, y: 80, color: MENUS_USER_BOX_BG},
            {name: 'avatar bar', x: 1517, y: 64, color: MENUES_AVATAR_BAR},
        ],
        nextScreens: {
            alertPopup: 1,
            loadingMap: 1,
            undefined: 1,
        }
    },
    alertPopup: {
        name: 'alertPopup',
        must: [
            {name: 'bg ul', x: 300, y: 200, color: ALERT_POPUP_BG},
            {name: 'bg lr', x: 1400, y: 1000, color: ALERT_POPUP_BG},
            {name: 'text bg ul', x: 20, y: 490, color: ALERT_POPUP_TEXT_BG},
            {name: 'text bg lr', x: 1500, y: 530, color: ALERT_POPUP_TEXT_BG},
            {name: 'actions bg ul', x: 40, y: 590, color: ALERT_POPUP_ACTIONS_BG},
            {name: 'actions bg lr', x: 1900, y: 630, color: ALERT_POPUP_ACTIONS_BG},
        ],
        nextScreens: {
            // All equal
        },
        maxDuration: MAX_DURATION_SANE
    },
    loadingMap: {
        name: 'loadingMap',
        must: [
            {name: 'overwatch logo ul', x: 1750, y: 940, color: LOADING_MAP_OVERWATCH_LOGO},
            {name: 'overwatch logo lr', x: 1800, y: 980, color: LOADING_MAP_OVERWATCH_LOGO},
            {name: 'tip bg ul', x: 20, y: 760, color: LOADING_MAP_TIP_BG},
            {name: 'tip bg lr', x: 570, y: 770, color: LOADING_MAP_TIP_BG},
        ],
        nextScreens: {
            heroSelection: 1
        },
        maxDuration: 8_000
    },
    heroSelection: {
        name: 'heroSelection',
        must: [
            {name: 'skin bg ul', x: 1425, y: 220, color: HERO_SELECTION_SKIN_BG},
            {name: 'skin bg lr', x: 1800, y: 230, color: HERO_SELECTION_SKIN_BG},
            {name: 'exclamation mark bg ul', x: 1815, y: 120, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
            {name: 'exclamation mark bg lr', x: 1855, y: 145, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
            {name: 'horizontal line l', x: 140, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
            {name: 'horizontal line r', x: 1750, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
        ],
        nextScreens: {
            matchAlive: 1
        },
        maxDuration: 30_000
    },
    matchAlive: {
        name: 'matchAlive',
        should: [
            ...IN_GAME_RETICLE, // Can't be "must", because the red kill icon overlays the reticle
            {name: 'health bar minimum filled', x: 261, y: 966, color: MATCH_HEALTH_BAR_FILLED},
        ],
        might: [
            {name: 'on fire bar maximum not filled', x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
            ...IN_GAME_ON_FIRE_ICONS,
        ],
        nextScreens: {
            matchDead: 1,
            scoreBoard: .7,
            interactionMenu: .5,
            matchNoPrimary: .4,
            alertPopup: .4,
            undefined: .4,
        }
    },
    matchNoPrimary: {
        name: 'matchNoPrimary',
        should: [
            {name: 'health bar minimum filled', x: 261, y: 966, color: MATCH_HEALTH_BAR_FILLED}
        ],
        might: [
            {name: 'on fire bar maximum not filled', x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
            ...IN_GAME_ON_FIRE_ICONS,
        ],
        nextScreens: {
            matchAlive: 1.3,
            matchDead: .9
        },
        maxDuration: 20_000 // Theoretically longer by staying in emote
    },
    matchDead: {
        name: 'matchDead',
        must: [
            {name: 'health bar minimum empty', x: 270, y: 966, color: MATCH_HEALTH_BAR_EMPTY},
            ...IN_GAME_ON_FIRE_ICONS,
        ],
        should: [
            {name: 'blood ul', x: 10, y: 25, color: MATCH_DEAD_BLOOD_UL, contrast: {x: 135, y: 100}},
            {name: 'blood lr', x: 1910, y: 1070, color: MATCH_DEAD_BLOOD_LR, contrast: {x: 1790, y: 991}},
        ],
        might: [
            {name: 'on fire bar maximum empty', x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
        ],
        nextScreens: {
            killcam: 1,
            black: 1,
            scoreBoard: .7,
            deadSpectating: .7,
        },
        maxDuration: 4_000
    },
    killcam: {
        name: 'killcam',
        must: [
            {name: 'white border bottom l', x: 400, y: 828, color: KILLCAM_WHITE_BORDER_BOTTOM},
            {name: 'white border bottom r', x: 1970, y: 827, color: KILLCAM_WHITE_BORDER_BOTTOM},
            {name: 'countdown border ul', x: 1800, y: 40, color: KILLCAM_WHITE_BORDER_COUNTDOWN},
            {name: 'countdown border lr', x: 1860, y: 90, color: KILLCAM_WHITE_BORDER_COUNTDOWN},
            {name: 'dark oberlay bottom ll', x: 200, y: 970, color: KILLCAM_DARK_OVERLAY_BOTTOM},
            {name: 'dark oberlay bottom ur', x: 1800, y: 900, color: KILLCAM_DARK_OVERLAY_BOTTOM},
            {name: 'dark global overlay', x: 300, y: 300, color: KILLCAM_DARK_GLBOAL_OVERLAY},
            // Same as "DARK_OVERLAY" constant but without contrast:
            {name: 'dark overlay top border ul', x: 200, y: 126, color: DARK_OVERLAY_TOP_BORDER},
            {name: 'dark overlay top ur', x: 1800, y: 127, color: DARK_OVERLAY_TOP_BORDER},
            {name: 'dark overlay top bg ul', x: 120, y: 115, color: DARK_OVERLAY_TOP_BG},
            {name: 'dark overlay top bg ur', x: 1700, y: 25, color: DARK_OVERLAY_TOP_BG},
        ],
        nextScreens: {
            deadSpectating: .9,
            matchAlive: .9,
            black: .9,
            scoreBoard: .7,
        },
        maxDuration: 6_000
    },
    deadSpectating: {
        name: 'deadSpectating',
        must: [
            {name: 'health bar minimum empty', x: 270, y: 966, color: MATCH_HEALTH_BAR_EMPTY},
            ...IN_GAME_ON_FIRE_ICONS,
            ...DARK_OVERLAY_TOP
        ],
        should: [
            {name: 'respawn countdown border', x: 1836, y: 18, color: SPECTATE_RESPAWN_COUNTDOWN_BORDER},
        ],
        nextScreens: {
            matchAlive: 1,
            black: 1,
            scoreBoard: .7,
        },
        maxDuration: 7_000
    },
    potgSpectating: {
        name: 'potgSpectating',
        must: [
            ...DARK_OVERLAY_TOP
        ],
        should: [
            ...IN_GAME_RETICLE,
            {name: 'health bar minimum filled', x : 270, y: 966, color: MATCH_HEALTH_BAR_FILLED},
        ],
        might: [
        ],
        nextScreens: {
            undefined: 1,
        },
        maxDuration: 11_000
    },
    scoreBoard: {
        name: 'scoreBoard',
        must: [
            {name: 'top bg ul', x: 160, y: 25, color: SCORE_BOARD_TOP_BOTTOM_BG},
            {name: 'top bg lr', x: 1500, y: 70, color: SCORE_BOARD_TOP_BOTTOM_BG},
            {name: 'bottom bg', x: 960, y: 1050, color: SCORE_BOARD_TOP_BOTTOM_BG},
            {name: 'global overlay ul', x: 300, y: 300, color: SCORE_BOARD_GLOBAL_OVERLAY},
            {name: 'global overlay lr', x: 1600, y: 600, color: SCORE_BOARD_GLOBAL_OVERLAY},
            {name: 'line center l', x: 500, y: 459, color: SCORE_BOARD_LINES},
            {name: 'line center r', x: 1400, y: 460, color: SCORE_BOARD_LINES},
            {name: 'line bottom', x: 963, y: 1010, color: SCORE_BOARD_LINES},
            {name: 'line top', x: 42, y: 50, color: SCORE_BOARD_MODE_LINES},
        ],
        nextScreens: {
            matchAlive: 1,
            matchDead: 1,
            killcam: .7,
            deadSpectating: .7,
            potgSpectating: .5,
            black: .5,
        },
        maxDuration: MAX_DURATION_SANE
    },
    interactionMenu: {
        name: 'interactionMenu',
        must: [
            {name: 'outer circle ul', x: 885, y: 485, color: INTERACTION_MENU_OUTER_CIRCLE},
            {name: 'outer circle lr', x: 1030, y: 600, color: INTERACTION_MENU_OUTER_CIRCLE},
        ],
        should: [
            {name: 'overlay ul', x: 10, y: 25, color: INTERACTION_MENU_OVERLAY},
            {name: 'overlay lr', x: 1910, y: 1070, color: INTERACTION_MENU_OVERLAY},
            {name: 'overlay ur', x: 1500, y: 70, color: INTERACTION_MENU_OVERLAY},
            {name: 'overlay ll', x: 261, y: 966, color: INTERACTION_MENU_OVERLAY},
        ],
        nextScreens: {
            matchAlive: 1,
            matchNoPrimary: .7
        },
        maxDuration: MAX_DURATION_SANE
    },
    black: {
        name: 'black',
        must: [
            {name: 'black center', x: 957, y: 539, color: BLACK},
            {name: 'black ul', x: 120, y: 115, color: BLACK},
            {name: 'black ll', x: 470, y: 980, color: BLACK},
            {name: 'black lr', x: 1750, y: 740, color: BLACK},
            {name: 'black ul', x: 1700, y: 25, color: BLACK},
        ],
        nextScreens: {
            killcam: 1,
            matchAlive: 1,
            scoreBoard: .8,
            deadSpectating: .8
        },
        maxDuration: 2_000
    },
    undefined: {
        name: 'undefined',
        // Default screen for not yet defined screens
        // might: [{x: 10, y: 10, color: {r: 0, g: 0, b: 0, a: 0}}],
        nextScreens: {
            menues: .6,
            alertPopup: .6,
            matchAlive: .6,
            potgSpectating: .6,
        }
    }
};

/**
 * Class which returns the existing screens.
 *
 * Areas to avoid:
 * - Upper left corner (20px height on 1080): FPS
 * - Voice chat overlay
 * - Discord overlay?
 */
@Injectable({
    providedIn: 'root'
})
export class ScreenSettingsService<TScreenName extends OverwatchScreenName = OverwatchScreenName> {

    private scaledScreens?: ScreensModel<TScreenName>;

    public init(width = 1920, height = 1080): void {
        this.scaledScreens = screens as unknown as ScreensModel<TScreenName>;
        for (const key of Object.keys(this.scaledScreens)) {
            if (this.scaledScreens[key].must) {
                this.scaledScreens[key].must = this.scaleScreenPoints(this.scaledScreens[key].must, width, height);
            }
            if (this.scaledScreens[key].should) {
                this.scaledScreens[key].should = this.scaleScreenPoints(this.scaledScreens[key].should, width, height);
            }
            if (this.scaledScreens[key].might) {
                this.scaledScreens[key].might = this.scaleScreenPoints(this.scaledScreens[key].might, width, height);
            }
        }
    }

    public getScreens(): ScreensModel<TScreenName> {
        return this.scaledScreens;
    }

    public getScreen(
        screenName: OverwatchScreenName
    ): Screen<TScreenName> {
        return this.getScreens()[screenName];
    }

    private scaleScreenPoints(screenPoints: ScreenPoint[], width: number, height: number): ScreenPoint[] {
        return screenPoints.map((screenPoint) => ({
            ...screenPoint,
            ...PositionUtils.scale(screenPoint, width, height)
        }));
    }
}
