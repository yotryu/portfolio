export class Range
{
    min: number;
    max: number;

    constructor(min: number, max: number = undefined)
    {
        this.min = min;

        if (max)
        {
            this.max = max;
        }
        else
        {
            this.max = min;
        }
    }

    range()
	{
		return this.max - this.min;
	}

	random()
	{
		return Math.random() * this.range() + this.min;
	}

    randomInt()
    {
        return Math.floor(this.random());
    }
}

export interface OrientationValue
{
    l: number;
    p: number;
}

export function getOrientationValue(value: number | OrientationValue): number
{
    if (value == undefined)
    {
        return undefined;
    }

    if (typeof value == "number")
    {
        return <number>value;
    }

    if (this.canvas.clientWidth > this.canvas.clientHeight)
    {
        // landscape
        return value.l;
    }

    // portrait
    return value.p;
}