import React from "react";
import Form from "../../shard-dashboard/form/Form.jsx";
import InputGroup from "../../shard-dashboard/input-group/InputGroup.jsx";
import InputGroupAddon from "../../shard-dashboard/input-group/InputGroupAddon.jsx";
import InputGroupText from "../../shard-dashboard/input-group/InputGroupText.jsx";
import FormInput from "../../shard-dashboard/form-input/FormInput.jsx";

export default () => (
  <Form className="main-navbar__search w-100 d-none d-md-flex d-lg-flex">
    <InputGroup seamless className="ml-3">
      <InputGroupAddon type="prepend">
        <InputGroupText>
          <i className="material-icons">search</i>
        </InputGroupText>
      </InputGroupAddon>
      <FormInput
        className="navbar-search"
        placeholder="Search for something..."
      />
    </InputGroup>
  </Form>
);
