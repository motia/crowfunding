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

  const [inputSharePrice, setInputSharePrice] = useState<number | undefined>(undefined);
  const WEI_MULTIPLIERS = {
    wei: 1,
    gwei: Math.pow(10, 9),
    eth: Math.pow(10, 18),
  }
  const [inputSharePriceUnit, setInputSharePriceUnit] = useState<'wei' | 'gwei' | 'eth'>('gwei');

  return <div>
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
              render={({inputs, inputTypes, state, handleInputChange, handleSubmit}: any) => {
                function syncSharePrice() {
                  handleInputChange({
                    target: {
                      name: 'sharePrice',
                      value: (inputSharePrice || 0) * WEI_MULTIPLIERS[inputSharePriceUnit],
                      type: 'number',
                    }
                  });
                }

                const inputsConfig: { [k: string]: { [attr: string]: string } } = {
                  name: {
                    label: 'Project name',
                    placeholder: 'Zeta Energy',
                  },
                  tokenName: {
                    label: 'Token Code',
                    placeholder: 'ZTH',
                  },
                  shares: {
                    label: 'Total number of shares',
                    placeholder: '1000',
                  },
                  sharePrice: {
                    label: 'Unit price of shares',
                    placeholder: '1000',
                  },
                  description: {
                    label: 'Project description',
                    placeholder: 'This project will give us infinite energy! And for free!!',
                  }
                };

                const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
                };
                return <form onSubmit={onSubmit}>
                  {
                    inputs.filter((input: { name: string }) => !['descriptionCid', 'sharePrice'].includes(input.name))
                      .map((input: any, index: number) =>
                        (
                          <div
                            className='field'
                            key={input.name}
                          >
                            <div className="control">
                              <label htmlFor={input.name} className="label">
                                {inputsConfig[input.name].label}
                              </label>
                              <input
                                id={input.name}
                                className="input"
                                required
                                name={input.name}
                                 type={inputTypes[index]}
                                value={state[input.name]}
                                placeholder={inputsConfig[input.name].placeholder}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        ))}

                  <div className="field is-grouped">
                    <div className="control is-expanded">
                      <label className="label"
                             htmlFor="sharePrice">
                        {inputsConfig.sharePrice.label}
                      </label>
                      <input
                        id='sharePrice'
                        className="input"
                        required
                        type='number'
                        onChange={e => {
                          (e.target.value || parseFloat(e.target.value) === 0) && setInputSharePrice(parseFloat(e.target.value));
                          syncSharePrice();
                        }}
                        placeholder={inputsConfig.sharePrice.placeholder}
                      />
                    </div>
                    <div className='control' style={{width: '6em'}}>
                      <label className='label'>&nbsp;</label>
                      <div className="select is-fullwidth">
                        <select
                          className='input'
                          onChange={e => {
                            setInputSharePriceUnit(e.target.value as any);
                            syncSharePrice();
                          }}
                          value={inputSharePriceUnit}
                        >
                          {
                            Object.keys(WEI_MULTIPLIERS).map(k => <option value={k} key={k}>{k.toUpperCase()}</option>)
                          }
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <label className="label"
                             htmlFor="description">
                        {inputsConfig.description.label}
                      </label>
                      <textarea
                        id='description'
                        className="input"
                        style={{resize: 'vertical', minHeight: '280px', width: '100%'}}
                        required
                        value={markdownSrc}
                        onChange={e => setMarkdownSrc(e.target.value)}
                        placeholder={inputsConfig.description.placeholder}
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
                </form>;
              }}
            />
          </div>
          <div className="column">
            <div style={{minHeight: '100%', border: 'solid 1px #ebebeb', borderRadius: '8px',}}>
              <div className="has-background-light py-2 px-4 has-text-weight-semibold">
                Description preview
              </div>
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
    <Link to="/">&laquo; back</Link>
  </div>
}

