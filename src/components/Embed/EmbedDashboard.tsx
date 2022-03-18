import {
  Box,
  Tab2,
  Tabs2,
  Dialog,
  DialogContent,
  IconButton, Heading, SpaceVertical, MessageBar, Paragraph
} from '@looker/components'
import { LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import React, { useCallback, useContext, useEffect} from 'react'
import styled, { css } from 'styled-components'

import { Dashboard } from './Dashboard'
import { EmbedProps } from './types'
import { Configure } from '../Configure/Configure'
import _ from 'lodash'
import { BsGear } from 'react-icons/bs'

export const EmbedDashboard: React.FC<EmbedProps> = ({
  dashboards,
  configurationData,
  updateConfigurationData,
  isAdmin,
}) => {
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const [tabId, setTabId] = React.useState('0')

  const configIconLocation = {
    position: 'absolute' as 'absolute',
    right: '1em',
    top: '1em',
    zIndex: 999,
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const handleSelectedTab = (index: string) => {
    setTabId(index)
  }
  
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
        <Tabs2
          tabId={tabId}
          onTabChange={(index) => handleSelectedTab(index.toString())}
        >
          {configurationData.dashboards.map(({ title }, index) => {
            return <Tab2 
              key={index.toString()} 
              id={index.toString()} 
              label={title}
            >
              <Dashboard
                    key={index.toString()} 
                    id={configurationData.dashboards[index]['id']}
                    running={running}
                    theme={configurationData.theme}
                    extensionContext={extensionContext}
                    setDashboard={setupDashboard}
                  />  
            </Tab2>
          })}
        </Tabs2>
    )}
    {isAdmin ? (
        <div style={configIconLocation}>
          <Dialog
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
              icon={<BsGear />}
              label="Configure Dashboards"
              size="medium"
            />
          </Dialog>
        </div>
    ) : (
        ''
      )} 
    </>
  )
}
