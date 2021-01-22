import * as actionTypes from './actions/actionCreators';
const initialState = {
	email: '',
	loginState: false,
	id: '',
	auth: false,
	financeData: {},
};

const reducer = (state = initialState, action) => {
	console.log(action);
	switch (action.type) {
		case actionTypes.LOGIN:
			return {
				...state,
				email: action.loginInformation.email,
				loginState: action.loginInformation.loggedIn,
				id: action.loginInformation.id,
			};
		case actionTypes.GET_FINANCE:
			if (action.financeType === 'bills') {
				return {
					...state,

					financeData: {
						income: state.financeData.income,
						bills: action.data.bills,
					},
				};
			} else if (action.financeType === 'income') {
				return {
					...state,

					financeData: {
						income: action.data.income,
						bills: state.financeData.bills,
					},
				};
			}
			break;

		case actionTypes.DELETE_ITEM:
			console.log(action);
			if (action.financeType === 'bills') {
				return {
					...state,

					financeData: {
						income: state.financeData.income,
						bills: action.filteredFinance,
					},
				};
			} else if (action.financeType === 'income') {
				return {
					...state,

					financeData: {
						income: action.filteredFinance,
						bills: state.financeData.bills,
					},
				};
			}
			break;

		default:
			console.log('failed');
			return state;
	}
};

export default reducer;
