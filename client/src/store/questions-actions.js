import { SERVER_LINK } from '../dev-server-link';
import { questionsActions } from './questions-slice'

export const fetchQuestionListData = () => {
    return async dispatch => {
        const fetchData = async () => {
            const response = await fetch(
                `${SERVER_LINK}/api/explore/problems`,
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
            dispatch(questionsActions.setLoading({ isLoading: true }));
            const questionsData = await fetchData();
            dispatch(
                questionsActions.replaceQuestionsList({
                    questions: questionsData || [],
                })
            );
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(questionsActions.setLoading({ isLoading: false }));
        }
    };
};

export const sendQuestionListData = (question) => {
    return async dispatch => {
        const sendRequest = async () => {
            const response = await fetch(
                `${SERVER_LINK}/api/explore/problems`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT',
                    body: JSON.stringify({
                        items: question.items,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Sending question data failed.');
            }
        };

        try {
            await sendRequest();
        } catch (error) {
            console.error(error);
        }
    };
};