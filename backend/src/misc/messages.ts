import { Response } from "express"

export function serverErrorMessage(res: Response, Object?: any) {
    console.log(res.status(500).json({
        success: false,
        message: "Internal Server Error!",
        data: Object
    }))
}

export function successMessage(res: Response, Object: any) {
    console.log(res.status(201).json({
        success: true,
        data: Object
    }))
}

export function failedMessage(res: Response, string: any) {
    console.log(res.status(400).json({
        success: false,
        message: string
    }))
}

export function notFoundMesage(res: Response, string: any) {
    console.log(res.status(404).json({
        success: false,
        message: string
    }))
}