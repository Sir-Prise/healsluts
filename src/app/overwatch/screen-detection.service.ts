import { Injectable } from '@angular/core';
import { ColorRGBA } from '../model/color-rgba.model';
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
            ]
        },
        alertPopup: {
            must: [
                {x: 300, y: 200, color: ALERT_POPUP_BG},
                {x: 1400, y: 1000, color: ALERT_POPUP_BG},
                {x: 20, y: 490, color: ALERT_POPUP_TEXT_BG},
                {x: 1500, y: 530, color: ALERT_POPUP_TEXT_BG},
                {x: 40, y: 590, color: ALERT_POPUP_ACTIONS_BG},
                {x: 1900, y: 630, color: ALERT_POPUP_ACTIONS_BG},
            ]
        },
        loadingMap: {
            must: [
                {x: 1750, y: 940, color: LOADING_MAP_OVERWATCH_LOGO},
                {x: 1800, y: 980, color: LOADING_MAP_OVERWATCH_LOGO},
                {x: 20, y: 760, color: LOADING_MAP_TIP_BG},
                {x: 570, y: 770, color: LOADING_MAP_TIP_BG},
            ]
        },
        heroSelection: {
            must: [
                {x: 1425, y: 220, color: HERO_SELECTION_SKIN_BG},
                {x: 1800, y: 230, color: HERO_SELECTION_SKIN_BG},
                {x: 1815, y: 120, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
                {x: 1855, y: 145, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
                {x: 1750, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
                {x: 140, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
            ]
        },
        matchAlive: {
            should: [
                ...IN_GAME_RETICLE, // Can't be "must", because the red kill icon overlays the reticle
                {x: 270, y: 966, color: MATCH_HEALTH_BAR_FILLED},
            ],
            might: [
                {x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ]
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
            ]
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
            ]
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
            ]
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
        }
    };

    private lastScreenName: string;
    private checksSinceLastFullCheck = 0;

    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
    ) {
    }

    public getScreen(frame: HTMLCanvasElement): string {
        this.colorUtilsService.resetCache();

        // It's likely the same screen as last time, so check that first
        let lastProbability: {probability: number, confidence: number};
        if (this.lastScreenName) {
            lastProbability = this.getScreenProbability(frame, this.screens[this.lastScreenName], true);
            if (
                this.checksSinceLastFullCheck < 5 &&
                (lastProbability.probability >= 0.8 || (lastProbability.probability >= 0.6 && lastProbability.confidence <= 0.6))
            ) {
                console.log(this.lastScreenName, lastProbability.probability, 'lastScreenName');
                this.checksSinceLastFullCheck++;
                return this.lastScreenName;
            }
        }

        // Calculate probabilities for all screens
        const screens = Object.entries(this.screens).filter((screen) => screen[0] !== this.lastScreenName);
        const screenProbabilities = screens.map((screen) => ({
            screenName: screen[0],
            probability: this.getScreenProbability(frame, screen[1], false)
        }));
        if (lastProbability) {
            screenProbabilities.push({screenName: this.lastScreenName, probability: lastProbability});
        }
        // console.log('probabilities', screenProbabilities);

        // Get screen with highest probability
        const best = screenProbabilities.sort((a, b) => {
            return b.probability.probability - a.probability.probability || b.probability.confidence - b.probability.confidence;
        })[0];

        console.log(best.screenName, best.probability.probability, 'best');
        this.checksSinceLastFullCheck = 0;
        // this.lastScreenName = best.screenName;
        return best.screenName;
    }

    private previousForgivenesses: Array<{x: number, y: number, time: number}> = [];

    /**
     * Calculates how many percent of ColorPosition match.
     *
     * This returns two numbers: The probability tells how many pixels have expected color, the confidence how the quality of defined
     * positions is (e.g. only "must" positions: 1, only "might": 0.3).
     */
    private getScreenProbability(
        frame: HTMLCanvasElement,
        screen: Screen,
        isCurrentScreen: boolean
    ): {probability: number, confidence: number} {
        const points = [
            ...(screen.must || []).map((colorPosition) => ({factor: 1, maxForgivness: 0, colorPosition})),
            ...(screen.should || []).map((colorPosition) => ({factor: 0.7, maxForgivness: 1, colorPosition})),
            ...(screen.might || []).map((colorPosition) => ({factor: 0.3, maxForgivness: 2, colorPosition}))
        ];
        const sum = points.reduce((prev, curr) => {
            // console.log('pxIsColor', this.colorUtilsService.pixelIsColor(frame, curr.colorPosition, curr.colorPosition.color), curr.colorPosition);
            return prev + (this.colorUtilsService.pixelIsColor(frame, curr.colorPosition, curr.colorPosition.color) ? curr.factor : 0);
        }, 0);
        const sumMax = points.reduce((prev, curr) => prev + curr.factor, 0);
        const probability = sum / sumMax;
        const confidence = sumMax / points.length;
        return {probability, confidence};
    }
}

interface ScreensModel {
    [screenName: string]: Screen;
}

interface Screen {
    must?: ColorRGBAPosition[];
    should?: ColorRGBAPosition[];
    might?: ColorRGBAPosition[];
}
