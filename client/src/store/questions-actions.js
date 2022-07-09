import { questionsActions } from './questions-slice'
import { uiActions } from './ui-slice';

export const fetchQuestionListData = () => {
    return async (dispatch) => {
        const fetchData = async () => {
            const response = await fetch(
                'http://localhost:5000/api/explore/problems',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                }
            );

            if (!response.ok) {
                throw new Error('Could not fetch question data!');
            }

            const data = await response.json();

            return data;
        };

        try {
            const questionsData = await fetchData();
            dispatch(
                questionsActions.replaceQuestionsList({
                    questions: questionsData || [],
                })
            );
        } catch (error) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    title: 'Error!',
                    message: 'Fetching cart data failed!',
                })
            );
        }
    };
};




export const sendQuestionListData = (cart) => {
    return async (dispatch) => {
        dispatch(
            uiActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending cart data!',
            })
        );

        const sendRequest = async () => {
            const response = await fetch(
                'https://react-http-bc7c5-default-rtdb.firebaseio.com/cart.json',
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        items: cart.items,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Sending cart data failed.');
            }
        };

        try {
            await sendRequest();

            dispatch(
                uiActions.showNotification({
                    status: 'success',
                    title: 'Success!',
                    message: 'Sent cart data successfully!',
                })
            );
        } catch (error) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    title: 'Error!',
                    message: 'Sending cart data failed!',
                })
            );
        }
    };
};
