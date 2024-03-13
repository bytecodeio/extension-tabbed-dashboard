import React, { Fragment, useState, useContext, useEffect } from "react";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { Button, Container, Nav, Navbar, Header } from "react-bootstrap";
import MenuIcon from "@mui/icons-material/Menu";
import defaultLogo from "../../assets/BytecodeLogo.png";
import { defaultLogoHeight } from "../../utils/constants";
import { CompanyLogo } from "../_lowLevel/CompanyLogo";

export const TopAppBar = ({ appConfig, onMenuClick, toolbarHeight }) => {
  return (


    <Container fluid className="padding-0">
    <div className="inner_page_block white_option"></div>

    <Navbar collapseOnSelect expand="lg">
      <Container fluid>

      <i class="far fa-bars slideOut"></i>

                  <CompanyLogo

                  style={{ zIndex: 1, position: "relative", right: "14px" }}
                  />



        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav className="align-items-center">
            <Navbar.Text>
            <p class="lightGray mb-0"><i class="far fa-arrow-left"></i> BACK</p>

            </Navbar.Text>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </Container>

  );
};
