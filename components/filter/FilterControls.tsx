import _ from 'lodash';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import Select, { ActionMeta } from 'react-select';

import { makeOptions } from '../../lib/filterHelpers';
import {
    Entity,
    sortStageOptions,
    updateSelectedFiltersInURL,
} from '../../lib/helpers';
import {
    ExploreActionMeta,
    ExploreOptionType,
    ExploreSelectedFilter,
    AttributeMap,
    AttributeNames,
    ISelectedFiltersByAttrName,
    DownloadSourceCategory,
} from '../../lib/types';
import FilterCheckList from '../FilterPanel/FilterCheckList';
import FilterPanel from '../FilterPanel/FilterPanel';
import FilterPropertyColumnShell from '../FilterPanel/FilterPropertyColumn';

interface IFilterControlsProps {
    setFilter: (actionMeta: any) => void;
    selectedFiltersByGroupName: ISelectedFiltersByAttrName;
    selectedFilters: ExploreSelectedFilter[];
    files: Entity[];
    getGroupsByProperty: any;
}

const isReleaseQCEnabled = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return (
        urlParams.has('rel') || urlParams.has('release') || urlParams.has('qc')
    );
};

const FilterControls: React.FunctionComponent<IFilterControlsProps> = observer(
    (props) => {
        const options = (attrName: AttributeNames): ExploreOptionType[] => {
            const ret = makeOptions(
                attrName,
                props.selectedFiltersByGroupName,
                props.files,
                props.getGroupsByProperty
            );
            ret.forEach((opt) => {
                opt.group = attrName;
                opt.isSelected = isOptionSelected(opt); // this call has to happen after setting `group`
            });
            return _.sortBy(ret, (o) => o.label);
        };

        const isOptionSelected = (option: ExploreSelectedFilter) => {
            return (
                _.find(props.selectedFilters, (o: ExploreSelectedFilter) => {
                    return o.value === option.value && option.group === o.group;
                }) !== undefined
            );
        };

        const handleChange = action(
            (
                value: any,
                actionMeta: ExploreActionMeta<ExploreSelectedFilter>
            ) => {
                props.setFilter(actionMeta);
            }
        );

        const selectOptions = [
            AttributeNames.AtlasName,
            AttributeNames.TissueorOrganofOrigin,
            AttributeNames.PrimaryDiagnosis,
            AttributeNames.assayName,
            AttributeNames.Level,
            AttributeNames.FileFormat,
        ].map((attrName) => {
            return {
                label: AttributeMap[attrName].displayName,
                options: options(attrName),
            };
        });

        return (
            <div className="filterControls">
                <div>
                    <div style={{ width: 220 }}>
                        <Select
                            isSearchable
                            classNamePrefix={'react-select'}
                            isClearable={false}
                            name="searchAll"
                            placeholder="Search all filters"
                            controlShouldRenderValue={false}
                            isMulti={true}
                            options={selectOptions}
                            hideSelectedOptions={false}
                            closeMenuOnSelect={false}
                            onChange={handleChange}
                            value={_.flatMap(
                                selectOptions,
                                (obj) => obj.options
                            ).filter((o) => o.isSelected)}
                        />
                    </div>
                </div>

                <div>
                    <div style={{ width: 100 }}>
                        <FilterPanel
                            placeholder={
                                AttributeMap[AttributeNames.AtlasName]
                                    .displayName
                            }
                        >
                            <FilterPropertyColumnShell
                                title={
                                    AttributeMap[AttributeNames.AtlasName]
                                        .displayName
                                }
                            >
                                <FilterCheckList
                                    setFilter={props.setFilter}
                                    filters={props.selectedFiltersByGroupName}
                                    options={options(AttributeNames.AtlasName)}
                                />
                            </FilterPropertyColumnShell>
                        </FilterPanel>
                    </div>
                </div>

                <div>
                    <div style={{ width: 100 }}>
                        <FilterPanel
                            placeholder={
                                AttributeMap[
                                    AttributeNames.TissueorOrganofOrigin
                                ].displayName
                            }
                        >
                            <FilterPropertyColumnShell
                                title={
                                    AttributeMap[
                                        AttributeNames.TissueorOrganofOrigin
                                    ].displayName
                                }
                            >
                                <FilterCheckList
                                    setFilter={props.setFilter}
                                    filters={props.selectedFiltersByGroupName}
                                    options={options(
                                        AttributeNames.TissueorOrganofOrigin
                                    )}
                                />
                            </FilterPropertyColumnShell>
                        </FilterPanel>
                    </div>
                </div>

                <div>
                    <div style={{ width: 120 }}>
                        <FilterPanel
                            placeholder={
                                AttributeMap[AttributeNames.PrimaryDiagnosis]
                                    .displayName
                            }
                        >
                            <div className={'filter-checkbox-list-container'}>
                                <FilterPropertyColumnShell
                                    title={
                                        AttributeMap[
                                            AttributeNames.PrimaryDiagnosis
                                        ].displayName
                                    }
                                >
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(
                                            AttributeNames.PrimaryDiagnosis
                                        )}
                                    />
                                </FilterPropertyColumnShell>
                                {/*<FilterPropertyColumnShell title={'Stage'}>*/}
                                {/*    <FilterCheckList*/}
                                {/*        setFilter={props.setFilter}*/}
                                {/*        filters={*/}
                                {/*            props.selectedFiltersByGroupName*/}
                                {/*        }*/}
                                {/*        options={sortStageOptions(*/}
                                {/*            options(AttributeNames.Stage)*/}
                                {/*        )}*/}
                                {/*    />*/}
                                {/*</FilterPropertyColumnShell>*/}
                            </div>
                        </FilterPanel>
                    </div>
                </div>

                <div>
                    <div style={{ width: 164 }}>
                        <FilterPanel placeholder={'Demographics'}>
                            <div className={'filter-checkbox-list-container'}>
                                <FilterPropertyColumnShell
                                    title={
                                        AttributeMap[AttributeNames.Gender]
                                            .displayName
                                    }
                                >
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(AttributeNames.Gender)}
                                    />
                                </FilterPropertyColumnShell>
                                <FilterPropertyColumnShell
                                    title={
                                        AttributeMap[AttributeNames.Race]
                                            .displayName
                                    }
                                >
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(AttributeNames.Race)}
                                    />
                                </FilterPropertyColumnShell>
                                <FilterPropertyColumnShell
                                    title={
                                        AttributeMap[AttributeNames.Ethnicity]
                                            .displayName
                                    }
                                >
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(
                                            AttributeNames.Ethnicity
                                        )}
                                    />
                                </FilterPropertyColumnShell>
                            </div>
                        </FilterPanel>
                    </div>
                </div>

                <div>
                    <div style={{ width: 100 }}>
                        <FilterPanel placeholder={'Assay'}>
                            <FilterPropertyColumnShell title={'Assay'}>
                                <FilterCheckList
                                    setFilter={props.setFilter}
                                    filters={props.selectedFiltersByGroupName}
                                    options={options(AttributeNames.assayName)}
                                />
                            </FilterPropertyColumnShell>
                        </FilterPanel>
                    </div>
                </div>

                <div>
                    <div style={{ width: 80 }}>
                        <FilterPanel placeholder={'File'}>
                            <div className={'filter-checkbox-list-container'}>
                                <FilterPropertyColumnShell title={'Level'}>
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(AttributeNames.Level)}
                                    ></FilterCheckList>
                                </FilterPropertyColumnShell>
                                <FilterPropertyColumnShell
                                    title={'File Format'}
                                >
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(
                                            AttributeNames.FileFormat
                                        )}
                                    ></FilterCheckList>
                                </FilterPropertyColumnShell>
                            </div>
                        </FilterPanel>
                    </div>
                </div>

                <div>
                    <div style={{ width: 170 }}>
                        <FilterPanel placeholder={'Download Source'}>
                            <FilterPropertyColumnShell
                                title={'Download Source'}
                            >
                                <FilterCheckList
                                    setFilter={props.setFilter}
                                    filters={props.selectedFiltersByGroupName}
                                    options={options(
                                        AttributeNames.downloadSource
                                    )
                                        .sort(
                                            (
                                                a: ExploreOptionType,
                                                b: ExploreOptionType
                                            ) => {
                                                const downloadSourceOrder = [
                                                    DownloadSourceCategory.dbgap,
                                                    DownloadSourceCategory.idcDbgap,
                                                    DownloadSourceCategory.idc,
                                                    DownloadSourceCategory.synapse,
                                                    DownloadSourceCategory.comingSoon,
                                                ];
                                                return (
                                                    downloadSourceOrder.indexOf(
                                                        a.label as DownloadSourceCategory
                                                    ) -
                                                    downloadSourceOrder.indexOf(
                                                        b.label as DownloadSourceCategory
                                                    )
                                                );
                                            }
                                        )
                                        .map((e: ExploreOptionType) => {
                                            const downloadLabels = {
                                                [DownloadSourceCategory.dbgap]:
                                                    'CDS/SB-CGC (dbGaP 🔒)',
                                                [DownloadSourceCategory.idc]:
                                                    'IDC (Imaging)',
                                                [DownloadSourceCategory.idcDbgap]:
                                                    'CDS/SB-CGC and IDC',
                                                [DownloadSourceCategory.synapse]:
                                                    'Synapse (Level 3-4)',
                                                [DownloadSourceCategory.comingSoon]:
                                                    'Coming Soon',
                                            };

                                            e.label =
                                                downloadLabels[
                                                    e.label as DownloadSourceCategory
                                                ];
                                            return e;
                                        })}
                                />
                            </FilterPropertyColumnShell>
                        </FilterPanel>
                    </div>
                </div>

                {isReleaseQCEnabled() && (
                    <div>
                        <div style={{ width: 120 }}>
                            <FilterPanel placeholder={'Release'}>
                                <FilterPropertyColumnShell title={'Release'}>
                                    <FilterCheckList
                                        setFilter={props.setFilter}
                                        filters={
                                            props.selectedFiltersByGroupName
                                        }
                                        options={options(
                                            AttributeNames.releaseVersion
                                        )}
                                    ></FilterCheckList>
                                </FilterPropertyColumnShell>
                            </FilterPanel>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export default FilterControls;
