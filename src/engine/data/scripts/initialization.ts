import {
    ArchetypeLife,
    ConsecutiveGreatScore,
    ConsecutivePerfectLife,
    GoodMultiplier,
    GreatMultiplier,
    HorizontalAlign,
    LevelBucket,
    Multiply,
    PerfectMultiplier,
    ScreenAspectRatio,
    Script,
    Subtract,
    UIComboConfiguration,
    UIComboText,
    UIComboValue,
    UIJudgment,
    UIJudgmentConfiguration,
    UIMenu,
    UIMenuConfiguration,
    UIPrimaryMetricBar,
    UIPrimaryMetricConfiguration,
    UIPrimaryMetricValue,
    UISecondaryMetricBar,
    UISecondaryMetricConfiguration,
    UISecondaryMetricValue,
} from 'sonolus.js'
import { archetypes } from '../archetypes'
import { buckets } from '../buckets'

/**
 * エンジンの初期化スクリプト
*/
export function initialization(): Script {
    // 定義済みのノーツエンティティ型のポインタを渡して
    // EntityInfoArrayからアーキタイプライフ型のポインタを取得する
    //   ※ ArchetypeLifeは自動的にEntityInfoArrayを参照する
    //   ※ これにより指定したノーツの判定発生時に行うライフ処理を定義できる
    // https://wiki.sonolus.com/sonolus.js-guide/ja/chapters/05.html

    // pointer = (load entityArray internal) and return as archetypeLife
    //   from specified ArcheTypePointer
    const noteLife = ArchetypeLife.of(archetypes.noteIndex)

    /**
     * 事前処理
    */
    const preprocess = [
        // メニューボタンの配置
        UIMenu.set(
            // anchorX (X position ?)
            Subtract(0.05, ScreenAspectRatio),
            // anchorY (Y position ?)
            0.95,
            // pivotX ( animation center pos?)
            0,
            // pivotY ( animation center pos?)
            1,
            // width 横幅
            Multiply(UIMenuConfiguration.scale, 0.15),
            // height 縦幅
            Multiply(UIMenuConfiguration.scale, 0.15),
            // rotation 回転角度
            0,
            // alpha 不透明度
            UIMenuConfiguration.alpha,
            // horizontalAlign 透明度
            HorizontalAlign.Center,
            // background 背景があるかどうか
            true
        ),
        // 判定表示の配置
        UIJudgment.set(
            0,
            -0.4,
            0.5,
            0,
            Multiply(UIJudgmentConfiguration.scale, 0.8),
            Multiply(UIJudgmentConfiguration.scale, 0.2),
            0,
            UIJudgmentConfiguration.alpha,
            HorizontalAlign.Center,
            false
        ),
        // コンボ値の配置
        UIComboValue.set(
            Multiply(ScreenAspectRatio, 0.7),
            0,
            0.5,
            0,
            Multiply(UIComboConfiguration.scale, 0.5),
            Multiply(UIComboConfiguration.scale, 0.25),
            0,
            UIComboConfiguration.alpha,
            HorizontalAlign.Center,
            false
        ),
        // コンボ値上テキストの配置
        UIComboText.set(
            Multiply(ScreenAspectRatio, 0.7),
            0,
            0.5,
            1,
            Multiply(UIComboConfiguration.scale, 0.5),
            Multiply(UIComboConfiguration.scale, 0.15),
            0,
            UIComboConfiguration.alpha,
            HorizontalAlign.Center,
            false
        ),
        // プライマリメトリクスの配置
        UIPrimaryMetricBar.set(
            Subtract(ScreenAspectRatio, 0.05),
            0.95,
            1,
            1,
            Multiply(UIPrimaryMetricConfiguration.scale, 0.6),
            Multiply(UIPrimaryMetricConfiguration.scale, 0.15),
            0,
            UIPrimaryMetricConfiguration.alpha,
            HorizontalAlign.Left,
            true
        ),
        // プライマリメトリクス内容の配置
        UIPrimaryMetricValue.set(
            Subtract(ScreenAspectRatio, 0.05),
            0.95,
            1,
            1,
            Multiply(UIPrimaryMetricConfiguration.scale, 0.6),
            Multiply(UIPrimaryMetricConfiguration.scale, 0.15),
            0,
            UIPrimaryMetricConfiguration.alpha,
            HorizontalAlign.Right,
            false
        ),
        // セカンダリメトリクスの配置
        UISecondaryMetricBar.set(
            Subtract(ScreenAspectRatio, 0.05),
            Subtract(0.9, Multiply(UIPrimaryMetricConfiguration.scale, 0.15)),
            1,
            1,
            Multiply(UISecondaryMetricConfiguration.scale, 0.6),
            Multiply(UISecondaryMetricConfiguration.scale, 0.15),
            0,
            UISecondaryMetricConfiguration.alpha,
            HorizontalAlign.Left,
            true
        ),
        // セカンダリメトリクス内容の配置
        UISecondaryMetricValue.set(
            Subtract(ScreenAspectRatio, 0.05),
            Subtract(0.9, Multiply(UIPrimaryMetricConfiguration.scale, 0.15)),
            1,
            1,
            Multiply(UISecondaryMetricConfiguration.scale, 0.6),
            Multiply(UISecondaryMetricConfiguration.scale, 0.15),
            0,
            UISecondaryMetricConfiguration.alpha,
            HorizontalAlign.Right,
            false
        ),

        // 定義済みのバケットのIndex番号を取って
        // EntityInfoArrayから指定したノーツエンティティの
        // レベルバケットのポインタを取得して
        // バケットの範囲を指定する
        LevelBucket.of(buckets.noteIndex).setBucket(50, 100, 200),

        // 判定タイプ別 スコア乗数
        PerfectMultiplier.set(1),
        GreatMultiplier.set(0.75),
        GoodMultiplier.set(0.5),
        // 判定タイプ 連続数別 スコア乗数
        ConsecutiveGreatScore.set(0.01, 10, 50),

        // パーフェクト発生時ライフを0加算
        noteLife.perfectLifeIncrement.set(0),
        // ミス発生時ライフを0加算
        noteLife.missLifeIncrement.set(0),
        // パーフェクト連続数別 ライフ加算
        ConsecutivePerfectLife.set(50, 10),
    ]

    /**
     * スポーン順序
     * 初期化スクリプトは必ず最初にスポーンするため0番目に設定
    */
    const spawnOrder = 0

    /**
     * 並列描画処理
     * このスクリプトは (並列ではなく)逐次処理で実行する
     * 事前実行が終わると即時終了する (trueが返ると終了なので)
    */
    const updateSequential = true

    return {
        // 事前処理
        preprocess: {
            code: preprocess,
        },
        // スポーン順序
        spawnOrder: {
            code: spawnOrder,
        },
        // 並列実行コールバック(このスクリプトでは即時終了)
        updateSequential: {
            code: updateSequential,
        },
    }
}
