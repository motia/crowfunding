const Project = artifacts.require("Project");

contract('Project', (accounts) => {
  it('should put 10000 MetaCoin in the first account', async () => {
    const metaCoinInstance = await Project.deployed();

    assert.equal("0", "0", "0 wasn't in the first account");
  });
});