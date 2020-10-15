require('openzeppelin-test-helpers/configure')({ web3, environment: 'truffle' });

const { singletons } = require('openzeppelin-test-helpers');

const Manager = artifacts.require("Manager");
const Project = artifacts.require("Project");

contract('Manager', (accounts) => {
    const sharePrice = 100;
    const sharesCount = 2000;
    let manager;

    beforeEach(async function () {
        const erc1820 = await singletons.ERC1820Registry(accounts[0]);
        manager = await Manager.deployed().catch((e) => {
            assert.fail(e);
        });
    });

    it('test create project', async () => {
        await (
            manager.createProject(
                'Project1', 'PJ', sharesCount,
                sharePrice,
                'cid(123145)',
                {gas: 6700000, from: accounts[1]}
            )
        )
            .catch((e) => {
                console.error(e);
                assert.fail('Failed creating project ' + e.toString());
            });

        const projects = await manager.getProjects();
        assert.strictEqual(projects.length, 1);

        const projectAddr = await manager.getProjectByToken('PJ');
        if (!projectAddr || parseInt(projectAddr) === 0) {
            assert.fail(`projectAddress should not be ${projectAddr}`);
        }
        assert.strictEqual(projects[0], projectAddr);

        const project = await Project.at(projectAddr);

        assert.notEqual(project, null);

        assert.strictEqual((await project.balanceOf(projectAddr)).toNumber(), sharesCount);
        assert.strictEqual((await project.totalSupply()).toNumber(), sharesCount);
    });

    it('invests into project', async function () {
        const projectAddr = await manager.getProjectByToken('PJ');
        const project = await Project.at(projectAddr);

        const investmentShares = 60;
        await project.invest({from: accounts[1], value: sharePrice * investmentShares});

        assert.strictEqual((await project.balanceOf(projectAddr)).toNumber(), sharesCount - investmentShares);
        assert.strictEqual((await project.balanceOf(accounts[1])).toNumber(), investmentShares);
        assert.strictEqual((await project.totalSupply()).toNumber(), sharesCount);

        const data = await project.getProjectDetails();
        assert.strictEqual(data.projectName,'Project1');
    });
});

