import Cookies from 'universal-cookie';
import * as actionCreators from './actionCreators';
import instance from './../../axiosDefault';

export const login = (loginInformation, props) => {
	const cookies = new Cookies();

	return dispatch => {
		instance
			.post('/login', {
				email: loginInformation.email,
				password: loginInformation.password,
			})
			.then(res => {
				console.log(res);
				if (res.status === 200 && res.data.msg === 'accepted') {
					const newInformation = {
						...loginInformation,
						loggedIn: true,
						password: '',
						id: res.data.id,
					};
					cookies.set('loginState', res.data.token);
					cookies.set('id', res.data.id);
					dispatch(loginData(newInformation));

					return res;
				} else {
					const errorData = {
						status: res.data.status,
						message: res.data.msg,
					};
					dispatch(error(errorData));
				}
			})
			.then(res => {
				props.history.push('/menu');
			})
			.catch(err => {
				const newInformation = {
					...loginInformation,
					loggedIn: false,
				};
				dispatch(loginData(newInformation));
			});
	};
};

export const signUpHandler = (signUpData, props) => {
	return dispatch => {
		instance
			.post(
				'/users',
				{
					email: signUpData.email,
					password: signUpData.password,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					mode: 'cors',
				}
			)
			.then(res => {
				if (res.data.msg === 'Benutzer erstellt!') {
					props.history.push('/');
				} else {
					const errorData = {
						...signUpData,
						status: res.data.status,
						message: res.data.msg.errors[0].msg,
					};
					dispatch(error(errorData));
				}
			})
			.catch(err => {
				console.log(err);
			});
	};
};

const loginData = loginInformation => {
	return {
		type: actionCreators.LOGIN,
		loginInformation: loginInformation,
	};
};

const error = errorData => {
	return {
		type: actionCreators.ERROR,
		error: errorData,
	};
};
