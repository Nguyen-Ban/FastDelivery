interface Message {
    id: string,
    content: string,
    senderId?: string,
    orderId: string
}

export { Message }