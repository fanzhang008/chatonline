const initState = {
    onlineUsers: {},
    onlineCount: 0,
    msgQueue: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case 'addUser':
            return {
                ...state,
                onlineUsers: {
                    ...state.onlineUsers,
                    ...action.user
                },
                onlineCount: state.onlineCount + 1
            };
        case 'enqueueMsg':
            return {
                ...state,
                msgQueue: [...state.msgQueue, action.content]
            }
        default: 
            return state
    }
}