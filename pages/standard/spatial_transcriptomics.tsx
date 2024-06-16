import { GetStaticProps } from 'next';
import React from 'react';
import DataStandard, { DataStandardProps } from '../../components/DataStandard';
import { getDataSchema, SchemaDataId } from '@htan/data-portal-schema';

const SpatialTranscriptomics: React.FunctionComponent<DataStandardProps> = (
    props
) => {
    return (
        <DataStandard {...props}>
            <div className="standards-content">
                <h1>HTAN Spatial Transcriptomics</h1>
                <p>
                    HTAN supports several spatial sequencing modalities.
                    Modalities supported are growing as new data are generated.
                </p>
                <p>
                    Spatial transcriptomic sequencing data are divided into four
                    primary levels coupled with an auxiliary set of files used
                    in or generated by processing workflows for spatial
                    transcriptomics:
                </p>
                <table className="table table-data-levels">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Definition</th>
                            <th>Example Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Raw sequencing data</td>
                            <td>FASTQs</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Aligned primary data</td>
                            <td>Aligned BAMs</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>
                                Derived biomolecular data mapped to image
                                positions
                            </td>
                            <td>
                                Barcodes, features, filtered and unfiltered
                                matrices
                            </td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>In progress</td>
                            <td>TBD</td>
                        </tr>
                        <tr>
                            <td>Auxiliary</td>
                            <td>
                                Additional data such as imaging, qc, and json
                                scale factors
                            </td>
                            <td>TIFF, JPG, PNG, JSON, HTML, etc</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DataStandard>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { dataSchemaData, schemaDataById } = await getDataSchema([
        SchemaDataId.VisiumSpatialTranscriptomicsRNASeqLevel1,
        SchemaDataId.VisiumSpatialTranscriptomicsRNASeqLevel2,
        SchemaDataId.VisiumSpatialTranscriptomicsRNASeqLevel3,
        SchemaDataId.VisiumSpatialTranscriptomicsAuxiliaryFiles,
    ]);

    return { props: { dataSchemaData, schemaDataById } };
};

export default SpatialTranscriptomics;
