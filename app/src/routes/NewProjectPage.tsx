import {Drizzle} from "@drizzle/store";
import React, {useState} from "react";
// @ts-ignore
import {newContextComponents} from "@drizzle/react-components";
import {Link} from "react-router-dom";
import {MarkdownDisplay} from "../components/MarkdownDisplay";
import {uploadMdToIpfs} from "../utils/ipfsClient";

const {ContractForm} = newContextComponents;

function EthAmountInputField({label, onChange, attrs}: {
  label: string;
  onChange: (amountInWei: number) => void;
  attrs: { [k: string]: string };
}) {
  const [inputSharePrice, setInputSharePrice] = useState<number | undefined>(undefined);
  const WEI_MULTIPLIERS = {
    wei: 1,
    gwei: Math.pow(10, 9),
    eth: Math.pow(10, 18),
  }
  const [inputSharePriceUnit, setInputSharePriceUnit] = useState<'wei' | 'gwei' | 'eth'>('gwei');

  function syncSharePrice() {
    onChange((inputSharePrice || 0) * WEI_MULTIPLIERS[inputSharePriceUnit]);
  }

  return <div className="field is-grouped">
    <div className="control is-expanded">
      <label className="label"
             htmlFor={attrs.id}>
        {label}
      </label>
      <input
        id={attrs.id}
        className="input"
        type='number'
        onChange={e => {
          (e.target.value || parseFloat(e.target.value) === 0) && setInputSharePrice(parseFloat(e.target.value));
          syncSharePrice()
        }}
        {...attrs}
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
  </div>;
}

export default function NewProjectPage({drizzle, drizzleState}: { drizzle: Drizzle, drizzleState: any }) {
  const [markdownSrc, setMarkdownSrc] = useState('');
  const [formLock, setFormLock] = useState(false);


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

                const inputsConfig: { [k: string]: { label: string; placeholder: string; } } = {
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
                    label: 'Share unit price',
                    placeholder: '1000',
                  },
                  description: {
                    label: 'Project description',
                    placeholder: 'This project will give us infinite energy! And for free!!',
                  }
                };

                const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
                  setFormLock(true);

                  event.persist();
                  event.preventDefault();

                  const cid = markdownSrc
                    ? await uploadMdToIpfs(markdownSrc)
                      .then((r => r.cid.toString()))
                      .catch(e => {
                        // eslint-disable-next-line no-restricted-globals
                        const shouldAbort = confirm('Storing the description of the project has failed,' +
                          ' do you want to abort creating the project?');

                        if (!shouldAbort) {
                          throw e;
                        }

                        console.error('Could not upload file to IPFS');
                        console.error(e);
                        return '';
                      })
                    : '';

                  handleInputChange({
                    target: {
                      name: 'descriptionCid',
                      value: cid,
                      type: 'text',
                    }
                  });

                  handleSubmit(event);
                  setFormLock(false);
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

                  <EthAmountInputField
                    label={inputsConfig.sharePrice.label}
                    attrs={{
                      id: 'sharePrice',
                      name: 'sharePrice',
                      placeholder: inputsConfig.sharePrice.placeholder,
                    }}
                    onChange={(value) =>
                      handleInputChange({
                        target: {
                          value: value,
                          type: 'number',
                          name: 'sharePrice',
                        }
                      })}
                  />

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
                    className={`button is-primary ${formLock ? 'is-loading' : ''}`}
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

