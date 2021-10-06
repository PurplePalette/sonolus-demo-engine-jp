import {
    Add,
    And,
    createEntityData,
    Draw,
    EntityMemory,
    Greater,
    GreaterOr,
    InputOffset,
    Not,
    Or,
    Pointer,
    Remap,
    Script,
    SkinSprite,
    Subtract,
    TemporaryMemory,
    Time,
    TouchST,
    TouchStarted,
} from 'sonolus.js'

class EntityDataPointer extends Pointer {
    public get time() {
        return this.to<number>(0)
    }
}

const EntityData = createEntityData(EntityDataPointer)

export function note(): Script {
    const spawnTime = EntityMemory.to<number>(0)
    const z = EntityMemory.to<number>(1)
    const minInputTime = EntityMemory.to<number>(2)
    const maxInputTime = EntityMemory.to<number>(3)

    const yCurrent = EntityMemory.to<number>(32)
    const inputState = EntityMemory.to<boolean>(33)

    const preprocess = [
        spawnTime.set(Subtract(EntityData.time, 1)),
        z.set(Subtract(1000, EntityData.time)),
        minInputTime.set(Add(EntityData.time, -0.2, InputOffset)),
        maxInputTime.set(Add(EntityData.time, 0.2, InputOffset)),
    ]

    const spawnOrder = Add(spawnTime, 1000)

    const shouldSpawn = GreaterOr(Time, spawnTime)

    const isTouchOccupied = TemporaryMemory.to<boolean>(0)

    const touch = And(
        TouchStarted,
        GreaterOr(TouchST, minInputTime),
        Not(isTouchOccupied),
        [inputState.set(true), isTouchOccupied.set(true)]
    )

    const radius = 0.2
    const yFrom = 1 + radius
    const yTo = -0.6

    const left = -radius
    const right = radius
    const top = Add(yCurrent, radius)
    const bottom = Subtract(yCurrent, radius)

    const updateParallel = Or(inputState, Greater(Time, maxInputTime), [
        yCurrent.set(Remap(spawnTime, EntityData.time, yFrom, yTo, Time)),
        Draw(
            SkinSprite.NoteHeadCyan,
            left,
            bottom,
            left,
            top,
            right,
            top,
            right,
            bottom,
            z,
            1
        ),
    ])

    return {
        preprocess: {
            code: preprocess,
        },
        spawnOrder: {
            code: spawnOrder,
        },
        shouldSpawn: {
            code: shouldSpawn,
        },
        touch: {
            code: touch,
        },
        updateParallel: {
            code: updateParallel,
        },
    }
}