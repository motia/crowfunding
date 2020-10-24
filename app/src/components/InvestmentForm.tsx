import React, {useState} from 'react';
import {Drizzle} from "@drizzle/store";
// @ts-ignore
import {newContextComponents} from "@drizzle/react-components";
import DynamicContractData from "./DynamicContractData";
import {abi as ProjectAbi} from '../web3/contracts/ProjectERC.json';
import {ProjectData} from "../types";

const {ContractForm} = newContextComponents;

export function InvestmentForm({projectId, drizzleState, drizzle}: { drizzle: Drizzle, drizzleState: any, projectId: string }) {
  const [investmentAmount, setInvestmentAmount] = useState<number | undefined>();

  return <>
    <div className="card mt-4">
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
            render={({inputs, inputTypes, state, handleInputChange, handleSubmit}: any) => {
              const max = project.sharesTotal - project.totalSharesSold;
              if (max === 0) {
                return <div className="message">
                  <div className="message-body">All investment shares are taken</div>
                </div>
              }
              return (
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
                        max={max}
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
              );
            }}
          />
          }
        />
      </div>
    </div>
  </>;
}
