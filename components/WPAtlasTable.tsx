import Link from 'next/link';
import React from 'react';
import { WPAtlas } from '../types';
import { getDefaultDataTableStyle } from '../lib/dataTableHelpers';
import DataTable from 'react-data-table-component';
import { Atlas, getAtlasPageURL } from '../lib/helpers';

interface IWPAtlasTableProps {
    synapseAtlasData: Atlas[];
}

export const WPAtlasTable: React.FunctionComponent<IWPAtlasTableProps> = (
    props
) => {
    const columns = [
        {
            name: 'Lead Institution',
            selector: (atlas: Atlas) => atlas.WPAtlas.lead_institutions,
            wrap: true,
            sortable: true,
        },
        {
            name: 'Atlas Name',
            selector: 'title.rendered',
            cell: (atlas: Atlas) => (
                <Link href={getAtlasPageURL(atlas.htan_name.toLowerCase())}>
                    <a>{atlas.htan_name}</a>
                </Link>
            ),
            wrap: true,
            sortable: true,
        },
        {
            name: 'Atlas Description',
            selector: 'title.rendered',
            cell: (atlas: Atlas) => (
                <Link href={getAtlasPageURL(atlas.htan_id.toLowerCase())}>
                    <a>
                        {atlas.WPAtlas ? atlas.WPAtlas.title.rendered : 'N/A'}
                    </a>
                </Link>
            ),
            wrap: true,
            sortable: true,
        },
        // {
        //     name: 'Atlas ID',
        //     selector: (atlas: Atlas) => atlas.htan_id.toUpperCase(),
        //     wrap: true,
        //     sortable: true,
        // },
    ];

    return (
        <DataTable
            columns={columns}
            data={props.synapseAtlasData}
            striped={true}
            noHeader={true}
            customStyles={getDefaultDataTableStyle()}
        />
    );
};