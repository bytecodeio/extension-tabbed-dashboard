import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  DialogManager,
  DialogContent,
  Button,
  Flex,
  FlexItem,
  IconButton, Heading, SpaceVertical, MessageBar, Paragraph
} from '@looker/components'
import { LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import React, { useCallback, useContext, useEffect } from 'react'
import styled, { css } from 'styled-components'

import { Dashboard } from './Dashboard'
import { EmbedProps } from './types'
import { Configure } from '../Configure/Configure'
import { ConfigurationData } from '../../types'
import _ from 'lodash'
import { LookerDashboardOptions } from '@looker/embed-sdk/lib/types'
import { IDashboardElement, IRequestSearchDashboardElements } from '@looker/sdk/lib/3.1/models'
import { IWriteDashboardElement } from '@looker/sdk/lib/3.1/models'

export const EmbedDashboard: React.FC<EmbedProps> = ({
  dashboards,
  configurationData,
  updateConfigurationData,
  isAdmin,
}) => {
  const [dashboardNext, setDashboardNext] = React.useState(true)
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [filters, setFilters] = React.useState({})
  const [properties, setProperties] = React.useState<any>({})
  const [tilesToHide, setTilesToHide] = React.useState<Array<number>>([])
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.core40SDK
 
  
  useEffect(() => {
    if (dashboards && dashboards[selectedTab]) {
    sdk.ok(sdk.dashboard_dashboard_elements(dashboards[selectedTab]['id']))
    .then((x:[IDashboardElement])=> {
      investigateTiles(x)
      // x.value.forEach((element:any)=> {
      //   const queryId = element?.result_maker?.query?.id
      //   if (queryId && queryId > 0) {
      //   sdk.run_query({query_id:queryId, result_format:'json'})
      //     .then((y) => {
      //       console.log(y)
      //       if (y.value?.length === 0) {
      //         setTilesToHide([...tilesToHide, parseInt(element.id)])
      //       }
      //     })
      //   }
      // })
    });
  }

  },[dashboards, selectedTab])

  useEffect(()=>{
    
    if (properties && properties.options  && tilesToHide.length >0) {
      console.log('hiding tiles:' + JSON.stringify(tilesToHide))
      // setTilesToHide([])
      let newLayouts: any = properties.options.layouts[0]
        .dashboard_layout_components.filter((layout_component) => {
          return !_.includes(tilesToHide, layout_component.dashboard_element_id)
        })      
      const newOptions = properties.options
      newOptions.layouts[0].dashboard_layout_components = newLayouts 
      dashboard.setOptions(newOptions)
    }
  }
  ,[tilesToHide, properties])

  const investigateTiles = async (dashboardElements: [IDashboardElement]) => {
    let arrayOfPromises : any[] = 
      dashboardElements.map((element:any)=> {
        const queryId = element?.result_maker?.query?.id
        if (queryId && queryId > 0) {
          return sdk.ok(sdk.run_query({query_id:queryId, result_format:'json'}))
        } 
        return Promise.resolve
      })
    const results = await Promise.allSettled(arrayOfPromises)
    // @ts-ignore
    const mappedResults = await results.map((x,i) => {
      if (x 
          && x.status === 'fulfilled' 
          && x.value
          && x.value.length === 0
      ) return parseInt(dashboardElements[i].id)
    })
    const filteredResults = await mappedResults.filter(x => !!x)
    setTilesToHide(filteredResults)
      // sdk.run_query({query_id:queryId, result_format:'json'})
      //   .then((y) => {
      //     console.log(y)
      //     if (y.value?.length === 0) {
      //       setTilesToHide([...tilesToHide, parseInt(element.id)])
      //     }
      //   })
      // }
    
  }

  const StyledTabList = styled(TabList as any)`
    background-color: #f4f4f4;
    border-bottom: none;
    padding-left: 1em;
  `

  const configIconLocation = {
    position: 'absolute' as 'absolute',
    right: '1em',
    top: '2em',
    zIndex: 999,
  }

  const StyledTab = styled(Tab as any)`
    border-bottom-color: transparent;
    margin-top: 2em;
    margin-bottom: 0;
    padding-bottom: 1em;
    padding-left: 2em;
    padding-right: 2em;
    ${(props) =>
      props.hover &&
      props.selected &&
      css`
        border-bottom-color: transparent;
        background-color: white;
      `}
    ${(props) =>
      props.selected &&
      css`
        background-color: white;
        border-bottom-color: transparent;
        border-top: 5px solid;
        border-top-color: #6c43e0;
        border-right: 1px solid;
        border-right-color: #e1e1e1;
        border-left: 1px solid;
        border-left-color: #e1e1e1;
      `}
    ${(props) =>
      props.hover &&
      css`
        border-bottom-color: transparent;
      `}
  `

  const toggleDashboard = () => {
    setDashboardNext(!dashboardNext)
  }

  const canceller = (event: any) => {
    return { cancel: !event.modal }
  }

  const updateRunButton = (running: boolean) => {
    setRunning(running)
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const handleSelectedTab = (index: number) => {
    setSelectedTab(index)
  }

  const isTabSelected = (index: number) => {
    return selectedTab == index ? true : false
  }

  const handleUpdateFilters = (filters: React.SetStateAction<{}>) => {
    setFilters(filters);
  };

  const handleUpdateDashboardProperties = (properties: React.SetStateAction<{}>) => {
    setProperties(properties);
  };

  return (
    <>
    {configurationData.dashboards.length == 0 && (
      <Box m="large" >
        <SpaceVertical>
      <Heading>Welcome to the Tabbed Dashboards Extension</Heading>

          <Paragraph>
            Please configure dashboards with the configuration icon at the right of the page.
          </Paragraph>
          </SpaceVertical>
      </Box>
    )}
    {configurationData.dashboards.length > 0 && (
      <div key={selectedTab}>
        <Tabs
          defaultIndex={selectedTab}
          onChange={(index) => handleSelectedTab(index)}
        >
          <StyledTabList
            selectedIndex={selectedTab}
            onSelectTab={(index: any) => handleSelectedTab(index)}
          >
            {configurationData.dashboards.map(({ title }, index) => {
              return <StyledTab key={index}>{title}</StyledTab>
            })}
          </StyledTabList>
          <TabPanels>
            {configurationData.dashboards.map(({ next }, index) => {
              return (
                <TabPanel key={index}>
                  <Dashboard
                    id={dashboards[selectedTab]['id']}
                    running={running}
                    theme={configurationData.theme}
                    next={next}
                    extensionContext={extensionContext}
                    setDashboard={setupDashboard}
                    filters={filters}
                    handleUpdateFilters={handleUpdateFilters}
                    handleUpdateDashboardProperties={handleUpdateDashboardProperties}
                  />
                </TabPanel>
              )
            })}
          </TabPanels>
        </Tabs>
        </div>
    )}
    {isAdmin ? (
        <div style={configIconLocation}>
          <DialogManager
            content={
              <DialogContent>
                <Configure
                  configurationData={configurationData}
                  updateConfigurationData={updateConfigurationData}
                />
              </DialogContent>
            }
          >
            <IconButton
              icon="GearOutline"
              label="Configure Dashboards"
              size="medium"
            />
          </DialogManager>
        </div>
    ) : (
        ''
      )}
      ) 
    </>
  )
}
