import { Injectable } from '@angular/core';
import { ColorRGBAPosition } from '../model/color-rgba-position.model';
import { ColorUtilsService } from '../utils/color-utils.service';

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

const DARK_OVERLAY_TOP_BORDER = {r: 255, g: 255, b: 255, a: 0.2};
const DARK_OVERLAY_TOP_BG = {r: 0, g: 0, b: 0, a: 0.36};
const IN_GAME_RETICLE_BG = {r: 255, g: 255, b: 255, a: 0.79};
const IN_GAME_RETICLE_BORDER = {r: 0, g: 0, b: 0, a: 0.34};
const IN_GAME_ON_FIRE_ICON = {r: 255, g: 255, b: 255, a: 0.85};
const IN_GAME_ON_FIRE_MAX_MARKER = {r: 255, g: 255, b: 255, a: 0.79};

// Common color positions
const DARK_OVERLAY_TOP = [
    {x: 200, y: 126, color: DARK_OVERLAY_TOP_BORDER},
    {x: 1800, y: 127, color: DARK_OVERLAY_TOP_BORDER},
    {x: 120, y: 115, color: DARK_OVERLAY_TOP_BG},
    {x: 1700, y: 25, color: DARK_OVERLAY_TOP_BG},
];
const IN_GAME_RETICLE = [
    // Currently, browsers always capture the cursor which overlays the reticle, so I picked a visible corner, not the center
    {x: 957, y: 539, color: IN_GAME_RETICLE_BG},
    {x: 962, y: 537, color: IN_GAME_RETICLE_BORDER},
];
const IN_GAME_ON_FIRE_ICONS = [
    {x: 257, y: 997, color: IN_GAME_ON_FIRE_ICON},
    {x: 432, y: 996, color: IN_GAME_ON_FIRE_MAX_MARKER},
];

type ScreenName = 'menues' | 'alertPopup' | 'loadingMap' | 'heroSelection' | 'matchAlive' | 'matchDead' | 'killcam' | 'deadSpectating' |
    'potgSpectating' | 'scoreBoard' | 'undefined';

@Injectable({
    providedIn: 'root'
})
export class ScreenDetectionService {
    private readonly screens: ScreensModel = {
        menues: {
            must: [
                {x: 1454, y: 39, color: MENUES_ADD_FRIEND_BTN_BG},
                {x: 1494, y: 80, color: MENUES_ADD_FRIEND_BTN_BG},
                {x: 1430, y: 40, color: MENUES_FIND_GROUP_BTN_BG},
                {x: 1390, y: 80, color: MENUES_FIND_GROUP_BTN_BG},
                {x: 1590, y: 40, color: MENUS_USER_BOX_BG},
                {x: 1850, y: 80, color: MENUS_USER_BOX_BG},
                {x: 1517, y: 64, color: MENUES_AVATAR_BAR},
            ],
            nextScreens: {
                alertPopup: 1,
                loadingMap: 1,
                undefined: 1,
            }
        },
        alertPopup: {
            must: [
                {x: 300, y: 200, color: ALERT_POPUP_BG},
                {x: 1400, y: 1000, color: ALERT_POPUP_BG},
                {x: 20, y: 490, color: ALERT_POPUP_TEXT_BG},
                {x: 1500, y: 530, color: ALERT_POPUP_TEXT_BG},
                {x: 40, y: 590, color: ALERT_POPUP_ACTIONS_BG},
                {x: 1900, y: 630, color: ALERT_POPUP_ACTIONS_BG},
            ],
            nextScreens: {
                // All equal
            }
        },
        loadingMap: {
            must: [
                {x: 1750, y: 940, color: LOADING_MAP_OVERWATCH_LOGO},
                {x: 1800, y: 980, color: LOADING_MAP_OVERWATCH_LOGO},
                {x: 20, y: 760, color: LOADING_MAP_TIP_BG},
                {x: 570, y: 770, color: LOADING_MAP_TIP_BG},
            ],
            nextScreens: {
                heroSelection: 1
            }
        },
        heroSelection: {
            must: [
                {x: 1425, y: 220, color: HERO_SELECTION_SKIN_BG},
                {x: 1800, y: 230, color: HERO_SELECTION_SKIN_BG},
                {x: 1815, y: 120, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
                {x: 1855, y: 145, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
                {x: 1750, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
                {x: 140, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
            ],
            nextScreens: {
                matchAlive: 1
            }
        },
        matchAlive: {
            should: [
                ...IN_GAME_RETICLE, // Can't be "must", because the red kill icon overlays the reticle
                {x: 261, y: 966, color: MATCH_HEALTH_BAR_FILLED},
            ],
            might: [
                {x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ],
            nextScreens: {
                matchDead: 1,
                scoreBoard: .7,
                alertPopup: .1,
                undefined: .3,
            }
        },
        matchDead: {
            must: [
                {x: 270, y: 966, color: MATCH_HEALTH_BAR_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ],
            should: [
                {x: 10, y: 10, color: MATCH_DEAD_BLOOD_UL},
                {x: 1910, y: 1070, color: MATCH_DEAD_BLOOD_LR},
            ],
            might: [
                {x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
            ],
            nextScreens: {
                killcam: 1,
                scoreBoard: .7,
                deadSpectating: .7,
            }
        },
        killcam: {
            must: [
                {x: 400, y: 828, color: KILLCAM_WHITE_BORDER_BOTTOM},
                {x: 1970, y: 827, color: KILLCAM_WHITE_BORDER_BOTTOM},
                {x: 1800, y: 40, color: KILLCAM_WHITE_BORDER_COUNTDOWN},
                {x: 1860, y: 90, color: KILLCAM_WHITE_BORDER_COUNTDOWN},
                {x: 200, y: 970, color: KILLCAM_DARK_OVERLAY_BOTTOM},
                {x: 1800, y: 900, color: KILLCAM_DARK_OVERLAY_BOTTOM},
                {x: 300, y: 300, color: KILLCAM_DARK_GLBOAL_OVERLAY},
                ...DARK_OVERLAY_TOP
            ],
            nextScreens: {
                deadSpectating: .9,
                matchAlive: .9,
                scoreBoard: .7,
            }
        },
        deadSpectating: {
            must: [
                {x: 270, y: 966, color: MATCH_HEALTH_BAR_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
                ...DARK_OVERLAY_TOP
            ],
            should: [
                {x: 1836, y: 18, color: SPECTATE_RESPAWN_COUNTDOWN_BORDER},
            ],
            nextScreens: {
                matchAlive: 1,
                scoreBoard: .7,
            }
        },
        potgSpectating: {
            must: [
                ...DARK_OVERLAY_TOP
            ],
            should: [
                ...IN_GAME_RETICLE,
                {x: 270, y: 966, color: MATCH_HEALTH_BAR_FILLED},
            ],
            might: [
                {x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ],
            nextScreens: {
                undefined: 1,
            }
        },
        scoreBoard: {
            must: [
                {x: 160, y: 15, color: SCORE_BOARD_TOP_BOTTOM_BG},
                {x: 1500, y: 70, color: SCORE_BOARD_TOP_BOTTOM_BG},
                {x: 960, y: 1050, color: SCORE_BOARD_TOP_BOTTOM_BG},
                {x: 300, y: 300, color: SCORE_BOARD_GLOBAL_OVERLAY},
                {x: 1600, y: 600, color: SCORE_BOARD_GLOBAL_OVERLAY},
                {x: 500, y: 459, color: SCORE_BOARD_LINES},
                {x: 1400, y: 460, color: SCORE_BOARD_LINES},
                {x: 963, y: 1010, color: SCORE_BOARD_LINES},
                {x: 42, y: 50, color: SCORE_BOARD_MODE_LINES},
            ],
            nextScreens: {
                matchAlive: 1,
                matchDead: 1,
                killcam: .7,
                deadSpectating: .7,
                potgSpectating: .5,
            }
        },
        undefined: {
            // Default screen for not yet defined screens
            // might: [{x: 10, y: 10, color: {r: 0, g: 0, b: 0, a: 0}}],
            nextScreens: {
                // All equal
            }
        }
    };

    private readonly screenNames: ScreenName[];
    private lastScreenName: ScreenName;
    private checksSinceLastFullCheck = 0;

    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
    ) {
        this.screenNames = Object.keys(this.screens) as ScreenName[];
    }

    public getScreen(frame: HTMLCanvasElement): ScreenName {
        this.colorUtilsService.resetCache();

        // Get all screens and their defined probability based on which was the last screen
        const screenBaseProbabilities = this.screenNames.reduce((prev, curr) => ({...prev, [curr]: 0}), {} as Record<ScreenName, number>);
        if (this.lastScreenName) {
            const lastScreen = this.screens[this.lastScreenName];
            for (const nextScreen of Object.entries(lastScreen.nextScreens)) {
                screenBaseProbabilities[nextScreen[0]] = nextScreen[1];
            }
            screenBaseProbabilities[this.lastScreenName] = 10;
        }
        // Sort
        const screenCheckOrder = Object.entries(screenBaseProbabilities)
            .map((probabilityEntry) => ({name: probabilityEntry[0] as ScreenName, probability: probabilityEntry[1]}))
            .sort((a, b) => {
                // Randomize order of equal ranked screens
                return b.probability - a.probability || Math.random() - .5;
            })
            .map((screenWithProbability) => screenWithProbability.name);

        // Check the first random n possible screens, as long there's at least one with a high probability
        const screenProbabilities: Array<{name: ScreenName, probability: ScreenProbability}> = [];
        for (const screen of screenCheckOrder) {
            if (screen === 'undefined') {
                // "undefined" screens always have the same probability
                screenProbabilities.push({name: 'undefined', probability: {probability: .7, confidence: .5}});
            } else {
                screenProbabilities.push({
                    name: screen,
                    probability: this.getScreenProbability(frame, this.screens[screen], screen === this.lastScreenName)
                });
            }

            if (screenProbabilities.some((screenProbability) => screenProbability.probability.probability >= .8) && Math.random() > .8) {
                break;
            }
        }

        // Get the screen with the highest probability (sort by pixel probability, previous screen prob., confidence)
        const sortedScreens = screenProbabilities.sort((a, b) => {
            return b.probability.probability - a.probability.probability ||
                screenBaseProbabilities[b.name] - screenBaseProbabilities[a.name] ||
                b.probability.confidence - a.probability.confidence;
        });

        this.lastScreenName = sortedScreens[0].name;

        console.log(this.lastScreenName, sortedScreens);
        return this.lastScreenName;
    }

    private previousForgivenesses: Array<{x: number, y: number, timesForgiven: number}> = [];

    /**
     * Calculates how many percent of ColorPosition match.
     *
     * This returns two numbers: The probability tells how many pixels have the expected color, the confidence how reliable this information
     * is (e.g. only "might" fields may have a high probability, but low confidence)
     */
    private getScreenProbability(
        frame: HTMLCanvasElement,
        screen: Screen,
        isCurrentScreen: boolean
    ): ScreenProbability {
        const points = [
            ...(screen.must || []).map((colorPosition) => ({factor: 1, maxForgivness: 0, colorPosition})),
            ...(screen.should || []).map((colorPosition) => ({factor: 0.7, maxForgivness: 1, colorPosition})),
            ...(screen.might || []).map((colorPosition) => ({factor: 0.3, maxForgivness: 2, colorPosition}))
        ];

        const previousForgiveness = this.previousForgivenesses;
        if (isCurrentScreen) {
            this.previousForgivenesses = [];
        }

        const sum = points.reduce((prev, curr) => {
            let pixelIsColor = this.colorUtilsService.pixelIsColor(frame, curr.colorPosition, curr.colorPosition.color);

            // "should" and "might" values are allowed to not be the correct color for 1 or 2 detections
            if (!pixelIsColor && isCurrentScreen && curr.maxForgivness > 0) {
                const previousForgivenessForPixel = previousForgiveness.find(
                    (forgivness) => forgivness.x === curr.colorPosition.x && forgivness.y === curr.colorPosition.y
                );
                const newTimesForgiven = previousForgivenessForPixel?.timesForgiven + 1 || 1;
                if (newTimesForgiven <= curr.maxForgivness) {
                    pixelIsColor = true;
                    this.previousForgivenesses.push({x: curr.colorPosition.x, y: curr.colorPosition.y, timesForgiven: newTimesForgiven});
                }
            }
            console.log('pixelIsColor', pixelIsColor, curr.colorPosition); // TODO      

            return prev + (pixelIsColor ? curr.factor : 0);
        }, 0);

        const sumMax = points.reduce((prev, curr) => prev + curr.factor, 0);
        const probability = sum / sumMax;

        // Calculate confidence
        // Decrease for forgiven values
        const forgivenValuesFactor = .7 ** (isCurrentScreen ? this.previousForgivenesses.length : 0);
        // Decrease for colors with high transparency
        const transparencyFactor = .8 ** points.filter((point) => point.colorPosition.color.a < .5).length;
        // Decrease for black + white
        const colorFactor = .9 ** points.map((point) => {
            const color = point.colorPosition.color;
            return color.r + color.g + color.b;
        }).filter((color) => color === 0 || color === 255 * 3).length;
        const confidence = sumMax * forgivenValuesFactor * transparencyFactor * colorFactor / points.length;

        return {probability, confidence};
    }
}

type ScreensModel = Record<ScreenName, Screen>;

interface Screen {
    must?: ColorRGBAPosition[];
    should?: ColorRGBAPosition[];
    might?: ColorRGBAPosition[];
    nextScreens: Partial<Record<ScreenName, number>>;
}

interface ScreenProbability {
    probability: number;
    confidence: number;
}
