import _ from 'lodash';
import React from 'react';

import {
    EnhancedDataTable,
    getDefaultDataTableStyle,
} from '@htan/data-portal-table';
import {
    convertAgeInDaysToYears,
    GenericAttributeNames,
} from '@htan/data-portal-utils';
import { Atlas, Entity } from '@htan/data-portal-commons';
import {
    generateColumnsForDataSchema,
    getAtlasColumn,
    sortByParticipantId,
} from '../lib/dataTableHelpers';
import { DataSchemaData, SchemaDataId } from '@htan/data-portal-schema';

interface ICaseTableProps {
    cases: Entity[];
    synapseAtlases: Atlas[];
    schemaDataById?: { [schemaDataId: string]: DataSchemaData };
    excludedColumns?: string[];
    genericAttributeMap?: { [attr: string]: GenericAttributeNames };
}

export const CaseTable: React.FunctionComponent<ICaseTableProps> = (props) => {
    const columns = generateColumnsForDataSchema(
        [
            SchemaDataId.Diagnosis,
            SchemaDataId.Demographics,
            SchemaDataId.Therapy,
        ],
        props.schemaDataById,
        props.genericAttributeMap,
        // need to add a custom sort function for the id
        {
            [GenericAttributeNames.ParticipantID]: {
                sortFunction: sortByParticipantId,
            },
            AgeatDiagnosis: {
                // we need to customize both the name and the tooltip since we convert days to years
                name: 'Age at Diagnosis (years)',
                headerTooltip:
                    'Age at the time of diagnosis expressed in number of years since birth.',
                format: (sample: Entity) =>
                    convertAgeInDaysToYears(sample.AgeatDiagnosis),
                cell: (sample: Entity) => (
                    <span className="ml-auto">
                        {convertAgeInDaysToYears(sample.AgeatDiagnosis)}
                    </span>
                ),
            },
            TreatmentType: {
                omit: false,
            },
        },
        // Component seems to be always "Diagnosis", no need to have a column for it
        ['Component', ...(props.excludedColumns ? props.excludedColumns : [])]
    );
    const indexOfParticipantId = _.findIndex(
        columns,
        (c) => c.selector === GenericAttributeNames.ParticipantID
    );
    // insert Atlas Name right after Participant ID
    columns.splice(
        indexOfParticipantId + 1,
        0,
        getAtlasColumn(props.synapseAtlases)
    );

    return (
        <EnhancedDataTable
            columns={columns}
            defaultSortField={GenericAttributeNames.ParticipantID}
            data={props.cases}
            striped={true}
            dense={false}
            noHeader={true}
            pagination={true}
            paginationPerPage={50}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 500]}
            customStyles={getDefaultDataTableStyle()}
        />
    );
};

export default CaseTable;
