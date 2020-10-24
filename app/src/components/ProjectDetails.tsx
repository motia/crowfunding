import {ProjectData} from "../types";
import React from "react";

export function ProjectDetails({address, project, action}: {
  address: string,
  project: ProjectData,
  action?: () => any
}) {
  return <div className="content">
    <div className="level">
      <div className="level-left">
        <div>
          <h3 className="title" style={{marginBottom: '8px'}}>{project.projectName}</h3>
          <h5 className="is-size-7">{address}</h5>
        </div>
      </div>

      <div className="level-right">
        <div>
          <div>
            <span className="is-size-5">Sold/Total</span>
          </div>

          <div className="has-text-right">
            {project.totalSharesSold || 0}/{project.sharesTotal} <span className="is-size-7">Shares</span>
          </div>
        </div>
      </div>
    </div>

    <div className="level">
      <div className="level-left">
        {action && action()}
      </div>
      <div className="level-right">
        <div className="is-size-5">
          {project.shareUnitPrice} <span className="has-text-weight-bold is-size-7">Wei/Share</span>
        </div>
      </div>
    </div>
  </div>
}
