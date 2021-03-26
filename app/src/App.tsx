import React, {useState} from 'react';
// @ts-ignore
import {DrizzleContext} from "@drizzle/react-plugin";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
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
import {ProjectData} from "./types";
import {ProjectDetails} from "./components/ProjectDetails";
import {InvestmentForm} from "./components/InvestmentForm";
import {abi as ProjectAbi} from './web3/contracts/ProjectERC.json';
import {MyInvestments} from "./routes/MyInvestments";
import {MyOrders} from "./routes/Orders";

const {AccountData, ContractData} = newContextComponents;

function App() {
  const [projectId, setProjectId] = useState('')
  return (
    <Router>
      <DrizzleContext.Consumer>
        {(drizzleContext: DrizzleContext) => {
          const {drizzle, drizzleState, initialized} = drizzleContext;
          if (!initialized) {
            return <></>;
          }

          return (
            <div className="section">
              <div className="container">
                <div className="columns">
                  <div className="column">
                    <div className="tabs">
                      <ul>
                        <li>
                          <NavLink to={`/`} exact activeClassName="is-active">
                            Home
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to={`/my-investments`} activeClassName="is-active">My Investments</NavLink>
                        </li>
                        <li>
                          <NavLink to={`/my-orders`} activeClassName="is-active">My Orders</NavLink>
                        </li>
                      </ul>
                    </div>

                    <Switch>
                      <Route path="/my-orders" children={<MyOrders/>}/>
                      <Route path="/my-investments" children={<MyInvestments/>}/>
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
