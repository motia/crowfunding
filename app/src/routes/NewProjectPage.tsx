import {Drizzle} from "@drizzle/store";
import React, {useState} from "react";
// @ts-ignore
import {newContextComponents} from "@drizzle/react-components";
import {Link} from "react-router-dom";
import {MarkdownDisplay} from "../components/MarkdownDisplay";
import {uploadMdToIpfs} from "../utils/ipfsClient";

const {ContractForm} = newContextComponents;

export default function NewProjectPage({drizzle, drizzleState}: { drizzle: Drizzle, drizzleState: any }) {
  const [markdownSrc, setMarkdownSrc] = useState('');

  return (<div>
      <h3 className="title">
        Create new project
      </h3>
      <div className="card">
        <div className="card-content">
          <div className="columns">
            <div className="column">
              <ContractForm
                drizzle={drizzle}
                drizzleState={drizzleState}
                sendArgs={{gas: 5 * 1000 * 1000}}
                contract='Manager'
                method="createProject"
                render={({inputs, inputTypes, state, handleInputChange, handleSubmit}: any) => (
                  <form onSubmit={async (event) => {
                    event.persist();
                    event.preventDefault();

                    let cid = '';
                    if (markdownSrc) {
                      try {
                        cid = (await uploadMdToIpfs(markdownSrc)).cid.toString();
                      } catch (e) {
                        console.error('Could not upload file to IPFS');
                        console.error(e);
                        // eslint-disable-next-line no-restricted-globals
                        const shouldContinue = confirm('Could not store the description of the project,' +
                          ' do you still want to create the project?')
                        // TODO: notify user of error!!
                        if (!shouldContinue) {
                          throw e;
                        }
                      }
                    }
                    handleInputChange({
                      target: {
                        name: 'descriptionCid',
                        value: cid,
                        type: 'text',
                      }
                    });


                    handleSubmit(event);
                  }}>
                    {
                      inputs.filter((x: { name: string }) => x.name !== 'descriptionCid')
                        .map((input: any, index: number) => (
                          <div className="field"
                               key={input.name}
                          >
                            <div className="control">
                              <input
                                className="input"
                                required
                                type={inputTypes[index]}
                                name={input.name}
                                value={state[input.name]}
                                placeholder={input.name}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        ))}
                    <div className="field">
                      <div className="control">
                        <textarea
                          className="input"
                          style={{resize: 'vertical', minHeight: '280px', width: '100%'}}
                          placeholder="Description"
                          required
                          onChange={e => setMarkdownSrc(e.target.value)}
                          value={markdownSrc}
                        />
                      </div>
                    </div>

                    <button
                      className="button is-primary"
                      key="submit"
                      type="submit"
                    >
                      Submit
                    </button>
                  </form>
                )}
              />
            </div>
            <div className="column">
              <div style={{minHeight: '100%', border: 'solid 1px #ebebeb', borderRadius: '8px',}}>
                <div className="has-background-light py-2 px-4 has-text-weight-semibold">Description preview</div>
                <div style={{padding: '12px'}}>
                  <MarkdownDisplay
                    markdownSrc={markdownSrc}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br/>
      <Link to="/">{'<<'} Back</Link>
    </div>
  )
}

