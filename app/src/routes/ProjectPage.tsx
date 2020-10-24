import React, {useEffect, useState} from 'react';
import {
  Link,
  useParams,
} from "react-router-dom";
import {Drizzle} from "@drizzle/store";
// @ts-ignore
import {newContextComponents} from "@drizzle/react-components";
import DynamicContractData from '../components/DynamicContractData';
import {abi as ProjectAbi} from '../web3/contracts/ProjectERC.json';
import {ProjectData} from '../types';
import {ProjectDetails} from "../components/ProjectDetails";
import {MarkdownDisplay} from "../components/MarkdownDisplay";
import {readMdFromIpfs} from "../utils/ipfsClient";

export function ProjectPage({drizzle, drizzleState, onEnter, onLeave}: {
  drizzle: Drizzle, drizzleState: any,
  onEnter?: (id: string) => void,
  onLeave?: (id: string) => void,
}) {
  const {id} = useParams<{ id: string }>();

  useEffect(() => {
    onEnter && onEnter(id);
    return () => {
      onLeave && onLeave(id);
    };
  }, [id]);

  return <div>
    <DynamicContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      method="getProjectDetails"
      abi={ProjectAbi}
      contract={id}
      address={id}

      render={(project: ProjectData) => (<div>
          <div className="card">
            <div className="card-content">
              <ProjectDetails
                address={id}
                project={project}
              />
            </div>
          </div>

          <div className="card  mt-4">
            <div className="card-content">
              <ProjectPreview
                cid={project.projectDescriptionCid}
              />
            </div>
          </div>
        </div>
      )}
    />


    <br/>
    <Link to="/">&laquo; back</Link>
  </div>
}

function ProjectPreview({cid}: { cid: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mdSrc, setMdSrc] = useState<string>('');
  useEffect(() => {
    if (!cid) {
      return;
    }
    readMdFromIpfs(cid).then(async (asyncBuffer) => {
      const chunks = [];
      setLoading(true);
      for await (const chunk of asyncBuffer) {
        chunks.push(String.fromCharCode(...chunk));
      }
      setMdSrc(chunks.join(''));
      setLoading(false);
    }).catch(e => {
      setError('Loading file has failed');
      throw e;
    })
  }, [cid]);

  return <div>{(() => {
    if (error) {
      return <div>{error}</div>
    }

    if (loading) {
      return <div>Loading...</div>
    }
    return <MarkdownDisplay markdownSrc={mdSrc}/>
  })()}</div>
}
