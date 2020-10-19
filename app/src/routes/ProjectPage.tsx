import React, {useEffect, useState} from 'react';
import {
  Link,
  useParams,
} from "react-router-dom";
import {Drizzle} from "@drizzle/store";
// @ts-ignore
import {newContextComponents} from "@drizzle/react-components";
import DynamicContractData from "../components/DynamicContractData";
import {abi as ProjectAbi} from '../web3/contracts/ProjectERC.json';
import {ProjectData} from '../types';
import {ProjectDetails} from "../components/ProjectDetails";
import {MarkdownDisplay} from "../components/MarkdownDisplay";
import {readMdFromIpfs} from "../utils/ipfsClient";

const {ContractForm} = newContextComponents;

export function ProjectPage({drizzle, drizzleState}: { drizzle: Drizzle, drizzleState: any }) {
  let {id} = useParams();

  let investmentAmount = 0;

  return <div>
    <h3 className="title">
      Project {id}
    </h3>

    <div className="card">
      <div className="card-content">
        <DynamicContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          method="getProjectDetails"
          abi={ProjectAbi}
          contract={id}
          address={id}

          render={(project: ProjectData) => (<div>
            Project details

            <div className="columns">
              <div className="column">
                <ProjectDetails
                  address={id}
                  project={project}
                />
              </div>
              <div className="column">
                <ProjectPreview
                  cid={'QmWBBykFZ3bzbT8u9USnqjcoUGyL1PHz1DJkPmHm4i5LtE' || project.projectDescriptionCid}
                />
              </div>
            </div>


            <ContractForm
              drizzle={drizzle}
              drizzleState={drizzleState}
              contract={id}
              method="invest"
              sendArgs={{value: investmentAmount, from: drizzleState.accounts[0], gaz: 5.4 * 1000 * 1000}}
              render={({inputs, inputTypes, state, handleInputChange, handleSubmit}: any) => (
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label" htmlFor="investmentAmount">
                      Investment amount in Wei
                    </label>

                    <div className="control">

                      <input
                        style={{maxWidth: '280px'}}
                        className="input"
                        required
                        type="number"
                        step="1"
                        onChange={(event) => {
                          investmentAmount = parseInt(event.target.value)
                        }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="button is-primary">Submit</button>
                </form>
              )}
            />
          </div>)}
        />

      </div>
    </div>

    <br/>
    <Link to="/">&laquo; back</Link>
  </div>
}

function ProjectPreview({cid}: {cid: string}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mdSrc, setMdSrc] = useState<string>('');
  useEffect(() => {
    readMdFromIpfs(cid).then(async (asyncBuffer) => {
      const chunks = [];
      for await (const chunk of asyncBuffer) {
        chunks.push(String.fromCharCode(...chunk));
      }
      setMdSrc(chunks.join(''));
      setLoading(false);
    }).catch(e => {
      setError('Loading file has failed');
      throw e;
    })
  }, []);

  return <div style={{border: 'solid 1px #ebebeb', borderRadius: '8px', minHeight: '150px', padding: '12px'}}>{(() => {
    if (error) {
      return <div>{error}</div>
    }

    if (loading) {
      return <div>Loading...</div>
    }
    return <MarkdownDisplay markdownSrc={mdSrc}/>
  })()}</div>
}
