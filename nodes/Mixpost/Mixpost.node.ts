import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class Mixpost implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mixpost',
		name: 'mixpost',
		icon: 'file:mixpost.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Mixpost API',
		defaults: {
			name: 'Mixpost',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'mixpostApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
				],
				default: 'post',
			},
			{
				displayName: 'Workspace UUID',
				name: 'workspaceUuid',
				type: 'string',
				default: '',
				required: true,
				description: 'The UUID of the workspace',
			},
			// Account Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a specific account',
						action: 'Get an account',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many social accounts',
						action: 'Get many accounts',
					},
				],
				default: 'getAll',
			},
			// Media Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['media'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a media file',
						action: 'Delete a media file',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a media file',
						action: 'Get a media file',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many media files',
						action: 'Get many media files',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a media file',
						action: 'Update a media file',
					},
					{
						name: 'Upload',
						value: 'upload',
						description: 'Upload a new media file',
						action: 'Upload a media file',
					},
				],
				default: 'getAll',
			},
			// Post Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
				options: [
					{
						name: 'Add to Queue',
						value: 'queue',
						description: 'Add a post to queue',
						action: 'Add post to queue',
					},
					{
						name: 'Approve',
						value: 'approve',
						description: 'Approve a post',
						action: 'Approve a post',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new post',
						action: 'Create a post',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a post',
						action: 'Delete a post',
					},
					{
						name: 'Delete Bulk',
						value: 'deleteBulk',
						description: 'Delete multiple posts',
						action: 'Delete multiple posts',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a post',
						action: 'Get a post',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many posts',
						action: 'Get many posts',
					},
					{
						name: 'Schedule',
						value: 'schedule',
						description: 'Schedule a post',
						action: 'Schedule a post',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a post',
						action: 'Update a post',
					},
				],
				default: 'create',
			},
			// Tag Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tag'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new tag',
						action: 'Create a tag',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a tag',
						action: 'Delete a tag',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a tag',
						action: 'Get a tag',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many tags',
						action: 'Get many tags',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a tag',
						action: 'Update a tag',
					},
				],
				default: 'getAll',
			},
			// Account Get
			{
				displayName: 'Account UUID',
				name: 'accountUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['get'],
					},
				},
				description: 'The UUID of the account',
			},
			// Media Fields
			{
				displayName: 'Media UUID',
				name: 'mediaUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['get', 'update'],
					},
				},
				description: 'The UUID of the media file',
			},
			{
				displayName: 'Media IDs',
				name: 'mediaIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['delete'],
					},
				},
				description: 'Comma-separated list of media IDs to delete',
			},
			{
				displayName: 'File',
				name: 'file',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['upload'],
					},
				},
				description: 'Binary property containing the file to upload',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Alt Text',
						name: 'alt_text',
						type: 'string',
						default: '',
						description: 'Alt text for the media file',
					},
				],
			},
			// Tag Fields
			{
				displayName: 'Tag UUID',
				name: 'tagUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['get', 'delete', 'update'],
					},
				},
				description: 'The UUID of the tag',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['create'],
					},
				},
				description: 'The name of the tag',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Color',
						name: 'hex_color',
						type: 'color',
						default: '',
						description: 'The color of the tag (hex format)',
					},
				],
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['tag'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the tag',
					},
					{
						displayName: 'Color',
						name: 'hex_color',
						type: 'color',
						default: '',
						description: 'The color of the tag (hex format)',
					},
				],
			},
			// Post Create
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
				description: 'The content of the post',
			},
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
				description: 'Comma-separated list of account IDs to post to',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Schedule Date',
						name: 'scheduleAt',
						type: 'dateTime',
						default: '',
						description: 'Date and time to schedule the post',
					},
					{
						displayName: 'Media URLs',
						name: 'media',
						type: 'string',
						default: '',
						description: 'Comma-separated list of media URLs to attach',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'Comma-separated list of tags',
					},
				],
			},
			// Post Schedule
			{
				displayName: 'Post UUID',
				name: 'postUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['schedule'],
					},
				},
				description: 'The UUID of the post to schedule',
			},
			{
				displayName: 'Schedule Date',
				name: 'scheduleAt',
				type: 'dateTime',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['schedule'],
					},
				},
				description: 'Date and time to schedule the post',
			},
			// Post Queue
			{
				displayName: 'Post UUID',
				name: 'postUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['queue'],
					},
				},
				description: 'The UUID of the post to add to queue',
			},
			// Post Approve
			{
				displayName: 'Post UUID',
				name: 'postUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['approve'],
					},
				},
				description: 'The UUID of the post to approve',
			},
			// Post Get/Delete/Update
			{
				displayName: 'Post UUID',
				name: 'postUuid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['get', 'delete', 'update'],
					},
				},
				description: 'The UUID of the post',
			},
			// Post Delete Bulk
			{
				displayName: 'Post IDs',
				name: 'postIds',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['deleteBulk'],
					},
				},
				description: 'Comma-separated list of post IDs to delete',
			},
			// Post Update
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Account IDs',
						name: 'accountIds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of account IDs',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'The content of the post',
					},
					{
						displayName: 'Media URLs',
						name: 'media',
						type: 'string',
						default: '',
						description: 'Comma-separated list of media URLs to attach',
					},
					{
						displayName: 'Schedule Date',
						name: 'scheduleAt',
						type: 'dateTime',
						default: '',
						description: 'Date and time to schedule the post',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'Comma-separated list of tags',
					},
				],
			},
			// Post Get All
			{
				displayName: 'Per Page Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Account IDs',
						name: 'accounts',
						type: 'string',
						default: '',
						description: 'Filter posts by account IDs (comma-separated list)',
					},
					{
						displayName: 'Keyword',
						name: 'keyword',
						type: 'string',
						default: '',
						description: 'Filter posts by keyword in content',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Draft',
								value: 'draft',
							},
							{
								name: 'Failed',
								value: 'failed',
							},
							{
								name: 'Needs Approval',
								value: 'needs_approval',
							},
							{
								name: 'Only From Trash',
								value: 'trash',
							},
							{
								name: 'Published',
								value: 'published',
							},
							{
								name: 'Scheduled',
								value: 'scheduled',
							},
						],
						default: 'draft',
						description: 'Filter posts by status',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'Filter posts by tags (comma-separated list)',
					},
				],
			},
			// Media Get All
			{
				displayName: 'Per Page Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['media'],
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			// Media/Tag Get All
			// {
			// 	displayName: 'Return All',
			// 	name: 'returnAll',
			// 	type: 'boolean',
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['media', 'tag'],
			// 			operation: ['getAll'],
			// 		},
			// 	},
			// 	default: false,
			// 	description: 'Whether to return all results or only up to a given limit',
			// },
			// {
			// 	displayName: 'Limit',
			// 	name: 'limit',
			// 	type: 'number',
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['media', 'tag'],
			// 			operation: ['getAll'],
			// 			returnAll: [false],
			// 		},
			// 	},
			// 	typeOptions: {
			// 		minValue: 1,
			// 	},
			// 	default: 50,
			// 	description: 'Max number of results to return',
			// },
			// Account Get All
			// {
			// 	displayName: 'Return All',
			// 	name: 'returnAll',
			// 	type: 'boolean',
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['account'],
			// 			operation: ['getAll'],
			// 		},
			// 	},
			// 	default: false,
			// 	description: 'Whether to return all results or only up to a given limit',
			// },
			// {
			// 	displayName: 'Limit',
			// 	name: 'limit',
			// 	type: 'number',
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['account'],
			// 			operation: ['getAll'],
			// 			returnAll: [false],
			// 		},
			// 	},
			// 	typeOptions: {
			// 		minValue: 1,
			// 	},
			// 	default: 50,
			// 	description: 'Max number of results to return',
			// },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('mixpostApi');

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const baseUrl = (credentials.url as string).replace(/\/$/, '');
		const accessToken = credentials.accessToken as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				let requestMethod: string = 'GET';
				let endpoint: string = '';
				let body: any = {};
				let qs: IDataObject = {};

				const workspaceUuid = this.getNodeParameter('workspaceUuid', i) as string;

				if (resource === 'account') {
					if (operation === 'get') {
						requestMethod = 'GET';
						const accountUuid = this.getNodeParameter('accountUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/accounts/${accountUuid}`;
					} else if (operation === 'getAll') {
						requestMethod = 'GET';
						endpoint = `/api/${workspaceUuid}/accounts`;
					}
				} else if (resource === 'media') {
					if (operation === 'getAll') {
						requestMethod = 'GET';
						endpoint = `/api/${workspaceUuid}/media`;

						qs.limit = this.getNodeParameter('limit', i) as number;
					} else if (operation === 'get') {
						requestMethod = 'GET';
						const mediaUuid = this.getNodeParameter('mediaUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/media/${mediaUuid}`;
					} else if (operation === 'upload') {
						requestMethod = 'POST';
						endpoint = `/api/${workspaceUuid}/media`;

						const dataBinary = this.getNodeParameter('file', i, 'data') as any;

						if (
							!dataBinary?.data ||
							!dataBinary.data.data ||
							!dataBinary.data.mimeType ||
							!dataBinary.data.fileName
						) {
							throw new NodeOperationError(
								this.getNode(),
								`Unsupported file: not binary or missing one or more required attributes (data, mimeType, fileName)`,
								{ itemIndex: i },
							);
						}

						const blob = new Blob([Buffer.from(dataBinary.data.data, 'base64')], {
							type: dataBinary.data.mimeType,
						});

						const formData = new FormData();
						formData.append('file', blob, dataBinary.data.fileName);

						// Set form data instead of JSON body
						body = formData;
					} else if (operation === 'update') {
						requestMethod = 'PUT';
						const mediaUuid = this.getNodeParameter('mediaUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/media/${mediaUuid}`;

						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						if (updateFields.alt_text) {
							body.alt_text = updateFields.alt_text;
						}
					} else if (operation === 'delete') {
						requestMethod = 'DELETE';
						endpoint = `/api/${workspaceUuid}/media`;

						const mediaIds = (this.getNodeParameter('mediaIds', i) as string)
							.split(',')
							.map((id) => id.trim())
							.filter((id) => id);
						body.items = mediaIds;
					}
				} else if (resource === 'tag') {
					if (operation === 'getAll') {
						requestMethod = 'GET';
						endpoint = `/api/${workspaceUuid}/tags`;
					} else if (operation === 'get') {
						requestMethod = 'GET';
						const tagUuid = this.getNodeParameter('tagUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/tags/${tagUuid}`;
					} else if (operation === 'create') {
						requestMethod = 'POST';
						endpoint = `/api/${workspaceUuid}/tags`;

						body.name = this.getNodeParameter('name', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.hex_color) {
							body.hex_color = additionalFields.hex_color;
						}
					} else if (operation === 'update') {
						requestMethod = 'PUT';
						const tagUuid = this.getNodeParameter('tagUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/tags/${tagUuid}`;

						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						if (updateFields.name) {
							body.name = updateFields.name;
						}
						if (updateFields.hex_color) {
							body.hex_color = updateFields.hex_color;
						}
					} else if (operation === 'delete') {
						requestMethod = 'DELETE';
						const tagUuid = this.getNodeParameter('tagUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/tags/${tagUuid}`;
					}
				} else if (resource === 'post') {
					if (operation === 'create') {
						requestMethod = 'POST';
						endpoint = `/api/${workspaceUuid}/posts`;

						body.content = this.getNodeParameter('content', i) as string;
						const accountIds = (this.getNodeParameter('accountIds', i) as string)
							.split(',')
							.map((id) => id.trim());
						body.account_ids = accountIds;

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (additionalFields.scheduleAt) {
							body.schedule_at = additionalFields.scheduleAt;
						}
						if (additionalFields.media) {
							body.media = (additionalFields.media as string).split(',').map((url) => url.trim());
						}
						if (additionalFields.tags) {
							body.tags = (additionalFields.tags as string).split(',').map((tag) => tag.trim());
						}
					} else if (operation === 'get') {
						requestMethod = 'GET';
						const postUuid = this.getNodeParameter('postUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/posts/${postUuid}`;
					} else if (operation === 'getAll') {
						requestMethod = 'GET';
						endpoint = `/api/${workspaceUuid}/posts`;

						qs.limit = this.getNodeParameter('limit', i) as number;

						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (filters.status) {
							qs.status = filters.status;
						}
						if (filters.keyword) {
							qs.keyword = filters.keyword;
						}
						if (filters.accounts) {
							// Convert comma-separated string to array
							const accountIds = (filters.accounts as string)
								.split(',')
								.map((id) => id.trim())
								.filter((id) => id);
							if (accountIds.length > 0) {
								qs.accounts = accountIds;
							}
						}
						if (filters.tags) {
							// Convert comma-separated string to array
							const tagNames = (filters.tags as string)
								.split(',')
								.map((tag) => tag.trim())
								.filter((tag) => tag);
							if (tagNames.length > 0) {
								qs.tags = tagNames;
							}
						}
						if (filters.page) {
							qs.page = filters.page;
						}
					} else if (operation === 'update') {
						requestMethod = 'PUT';
						const postUuid = this.getNodeParameter('postUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/posts/${postUuid}`;

						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						if (updateFields.content) {
							body.content = updateFields.content;
						}
						if (updateFields.scheduleAt) {
							body.schedule_at = updateFields.scheduleAt;
						}
						if (updateFields.media) {
							body.media = (updateFields.media as string).split(',').map((url) => url.trim());
						}
						if (updateFields.tags) {
							body.tags = (updateFields.tags as string).split(',').map((tag) => tag.trim());
						}
						if (updateFields.accountIds) {
							body.account_ids = (updateFields.accountIds as string)
								.split(',')
								.map((id) => id.trim());
						}
					} else if (operation === 'delete') {
						requestMethod = 'DELETE';
						const postUuid = this.getNodeParameter('postUuid', i) as string;
						endpoint = `/api/${workspaceUuid}/posts/${postUuid}`;
					} else if (operation === 'deleteBulk') {
						requestMethod = 'DELETE';
						endpoint = `/api/${workspaceUuid}/posts/bulk`;

						const postIds = (this.getNodeParameter('postIds', i) as string)
							.split(',')
							.map((id) => id.trim());
						body.post_ids = postIds;
					} else if (operation === 'schedule') {
						requestMethod = 'POST';
						endpoint = `/api/${workspaceUuid}/posts/schedule`;

						const postUuid = this.getNodeParameter('postUuid', i) as string;
						body.post_uuid = postUuid;
						body.schedule_at = this.getNodeParameter('scheduleAt', i) as string;
					} else if (operation === 'queue') {
						requestMethod = 'POST';
						endpoint = `/api/${workspaceUuid}/posts/queue`;

						const postUuid = this.getNodeParameter('postUuid', i) as string;
						body.post_uuid = postUuid;
					} else if (operation === 'approve') {
						requestMethod = 'POST';
						endpoint = `/api/${workspaceUuid}/posts/approve`;

						const postUuid = this.getNodeParameter('postUuid', i) as string;
						body.post_uuid = postUuid;
					}
				}

				const requestOptions: any = {
					method: requestMethod,
					url: `${baseUrl}${endpoint}`,
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				};

				// Add query parameters if present
				if (Object.keys(qs).length > 0) {
					requestOptions.qs = qs;
				}

				// Handle different body types
				if (resource === 'media' && operation === 'upload') {
					// For FormData uploads, body is FormData object - httpRequest handles this automatically
					requestOptions.body = body;
				} else if (Object.keys(body).length > 0) {
					// For JSON requests
					requestOptions.headers['Content-Type'] = 'application/json';
					requestOptions.body = body;
				}

				responseData = await this.helpers.httpRequest(requestOptions);

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else if (responseData && responseData.data && Array.isArray(responseData.data)) {
					returnData.push(...responseData.data);
				} else {
					returnData.push(responseData);
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					let errorMessage = 'An unknown error occurred';
					let errorDetails = {};

					if (error instanceof Error) {
						errorMessage = error.message;
					}

					// Handle HTTP errors with detailed validation responses
					if (error.response) {
						const statusCode = error.response.status;
						errorMessage = `HTTP ${statusCode}: ${error.response.statusText || 'Request failed'}`;

						// Laravel validation errors (422) usually contain detailed field errors
						if (error.response.data) {
							if (statusCode === 422 && error.response.data.errors) {
								// Laravel validation errors format
								errorDetails = {
									validationErrors: error.response.data.errors,
									message: error.response.data.message || 'Validation failed',
								};
								errorMessage = `Validation Error: ${
									error.response.data.message || 'The given data was invalid'
								}`;
							} else if (error.response.data.message) {
								// Other Laravel errors with message
								errorMessage = `${errorMessage} - ${error.response.data.message}`;
								errorDetails = error.response.data;
							} else if (typeof error.response.data === 'string') {
								errorMessage = `${errorMessage} - ${error.response.data}`;
							} else {
								errorDetails = error.response.data;
							}
						}
					}

					returnData.push({
						error: errorMessage,
						...(Object.keys(errorDetails).length > 0 && { errorDetails }),
					});
					continue;
				}

				// Enhanced error for non-continue-on-fail mode
				if (error.response && error.response.status === 422 && error.response.data?.errors) {
					const validationErrors = error.response.data.errors;
					const fieldErrors = Object.entries(validationErrors)
						.map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
						.join('; ');

					throw new NodeOperationError(
						this.getNode(),
						`Validation Error: ${
							error.response.data.message || 'The given data was invalid.'
						} - ${fieldErrors}`,
						{ itemIndex: i },
					);
				}

				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
