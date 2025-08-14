import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MixpostApi implements ICredentialType {
	name = 'mixpostApi';
	displayName = 'Mixpost API';
	documentationUrl = 'https://mixpost.io/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Mixpost URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'https://your-mixpost-instance.com/mixpost',
			required: true,
			description:
				'The base URL of your Mixpost instance and core path. Example: <code>https://your-mixpost-instance.com/mixpost</code>',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/api/ping',
			headers: {
				Accept: 'application/json',
			},
		},
	};
}
