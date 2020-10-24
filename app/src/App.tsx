import React, {useState} from 'react';
// @ts-ignore
import {DrizzleContext} from "@drizzle/react-plugin";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import {Drizzle} from "@drizzle/store";
// @ts-ignore
import {newContextComponents} from "@drizzle/react-components";
import NewProjectPage from './routes/NewProjectPage';
import {ProjectPage} from "./routes/ProjectPage";
import Pagination from './components/Pagination';
import {RouteComponentProps} from "react-router";
import DynamicContractData from "./components/DynamicContractData";
import {abi as ProjectAbi} from './web3/contracts/ProjectERC.json';
import {ProjectData} from "./types";
import {ProjectDetails} from "./components/ProjectDetails";

const {AccountData, ContractData, ContractForm} = newContextComponents;

function InvestmentForm({projectId, drizzleState, drizzle}: { drizzle: Drizzle, drizzleState: any, projectId: string }) {
  const [investmentAmount, setInvestmentAmount] = useState<number | undefined>();

  return <>
    <div className="title is-4 mt-4">
      Invest in project
    </div>
    <div className="card">
      <div className="card-content">
        <DynamicContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          method="getProjectDetails"
          abi={ProjectAbi}
          contract={projectId}
          address={projectId}
          render={(project: ProjectData) => <ContractForm
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract={projectId}
            method="invest"
            sendArgs={{value: investmentAmount, from: drizzleState.accounts[0], gaz: 5.4 * 1000 * 1000}}
            render={({inputs, inputTypes, state, handleInputChange, handleSubmit}: any) => (
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label" htmlFor="investmentAmount">
                    Number of shares
                  </label>

                  <div className="control">
                    <input
                      style={{maxWidth: '280px'}}
                      className="input"
                      required
                      type="number"
                      step="1"
                      min="1"
                      max={project.sharesTotal - project.totalSharesSold}
                      onChange={(event) => {
                        setInvestmentAmount(
                          event.target.value
                            ? parseInt(event.target.value) * project.shareUnitPrice
                            : 0
                        );
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className="button is-primary">Submit</button>
              </form>
            )}
          />
          }
        />
      </div>
    </div>
  </>;
}

function App() {
  const [projectId, setProjectId] = useState('')
  return (
    <Router>
      <DrizzleContext.Consumer>
        {(drizzleContext: DrizzleContext) => {
          const {drizzle, drizzleState, initialized} = drizzleContext;
          if (!initialized) {
            return "Loading...";
          }
          // @ts-ignore
          window.drizzle = drizzleState;
          // @ts-ignore
          window.drizzleState = drizzleState;
          // @ts-ignore
          window.ProjectAbi = ProjectAbi;

          return (
            <div className="section">
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <Switch>
                      <Route path="/projects/:id" children={<ProjectPage
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                        onEnter={setProjectId}
                        onLeave={() => {
                          setProjectId('')
                        }}
                      />}/>
                      <Route path="/new-project" exact children={
                        <NewProjectPage
                          drizzle={drizzle}
                          drizzleState={drizzleState}/>
                      }/>

                      <Route path="/" exact children={
                        <HomePage
                          drizzle={drizzle}
                          drizzleState={drizzleState}
                        />
                      }/>
                    </Switch>
                  </div>

                  <div className="column is-4">
                    <AccountData
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                      units="ether"
                      accountIndex={0}
                      render={({
                                 address,
                                 balance,
                                 units,
                               }: { balance: number, address: string, units: string }) => {
                        return (
                          <div className="card">
                            <div className="card-content">
                              <div className="content">
                                <small>{address}</small>

                                <div>
                                  {balance} <b>{units}</b>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }}
                    />

                    {projectId && <InvestmentForm
                      key={projectId}
                      projectId={projectId}
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                    />}
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </DrizzleContext.Consumer>
    </Router>
  );
}

function HomePage({drizzle, drizzleState}: { drizzle: Drizzle, drizzleState: any }) {
  return <div>
    <div className="level">
      <div className="level-left">
        <h3 className="title">
          Projects
        </h3>
      </div>
      <div className="level-right">
        <Link to="/new-project" className="button is-primary">Add project</Link>
      </div>
    </div>


    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract='Manager'
      method="getProjectsCount"
      render={(projectsCount: number) => {
        return <RoutePaginatedProjects
          drizzle={drizzle}
          drizzleState={drizzleState}
          itemsCount={projectsCount}
          perPage={10}
        />
      }}
    />
  </div>
}


function PaginatedProjects({
                             drizzle,
                             drizzleState,
                             itemsCount,
                             perPage,
                             history,
                           }: {
  drizzle: Drizzle,
  drizzleState: any,
  itemsCount: number,
  perPage: number,
} & RouteComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const currentCursor = (currentPage - 1) * perPage;
  const pagesCount = Math.floor(itemsCount / perPage) + (itemsCount % perPage === 0 ? 0 : 1);


  return <div>
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract='Manager'
      method="fetchPage"
      methodArgs={[currentCursor, perPage]}
      render={function (items: string[]) {
        if (!items) {
          return <div>Could not load projects..</div>
        }
        return <div>
          {
            items.map(address => <div className="card mb-5" key={address}>
              <div className="card-content">
                <DynamicContractData
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  method="getProjectDetails"
                  abi={ProjectAbi}
                  contract={address}
                  address={address}

                  render={(project: ProjectData) => (<ProjectDetails
                    project={project} address={address}
                    action={
                      () => <Link className="button is-link is-small" to={`/projects/${address}`}>Details</Link>
                    }
                  />)}
                />
              </div>
            </div>)
          }
        </div>
      }}
    />

    <div className="mt-4">
      <Pagination
        pages={pagesCount}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />
    </div>
  </div>
}


const RoutePaginatedProjects = withRouter(PaginatedProjects);

export default App;
