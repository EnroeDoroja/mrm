jest.mock('fs');
jest.mock('mrm-core/src/util/log', () => ({
	added: jest.fn(),
}));

const fs = require.requireActual('fs');
const path = require('path');
const { omitBy } = require('lodash');
const { getConfigGetter } = require('mrm');
const vol = require('memfs').vol;
const task = require('./index');

const stringify = o => JSON.stringify(o, null, '  ');

afterEach(() => vol.reset());

it('should add a Contributing.md file', () => {
	vol.fromJSON({
		[`${__dirname}/templates/Contributing.md`]: fs
			.readFileSync(path.join(__dirname, 'templates/Contributing.md'))
			.toString(),
		'/package.json': stringify({
			name: 'unicorn',
		}),
	});

	task(
		getConfigGetter({
			github: 'gendalf',
		})
	);

	expect(
		omitBy(vol.toJSON(), (v, k) => k.startsWith(__dirname))
	).toMatchSnapshot();
});
