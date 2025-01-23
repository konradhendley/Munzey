// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import React from 'react';
import { mount } from 'cypress/react'
import { BrowserRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component) => {
  // Wrap the component in BrowserRouter for routing context
  return mount(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
});