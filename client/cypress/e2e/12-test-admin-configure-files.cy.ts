describe("Admin configure custom CSS and JS", () => {
  it("should be able to configure the file upload", () => {
    cy.login_admin();

    cy.visit("#/admin/settings");

    cy.get('[data-cy="files"]').click();

    cy.get("[name='authenticationData.session.permissions.can_upload_files']").should("not.be.checked");
    cy.get("[name='authenticationData.session.permissions.can_upload_files_switch']").click();
    cy.get(".modal").should("be.visible");
    cy.get(".modal [type='password']").type("wrongpassword");
    cy.get(".modal .btn-primary").click();

    cy.get(".modal [type='password']", { timeout: 5000 })
      .should('not.have.value') // Check the input is emptied due to the wrong password
      .and('have.value', '');

    cy.get(".modal [type='password']").clear().type(Cypress.env("user_password"));
    cy.get(".modal .btn-primary").click();
    cy.get("[name='authenticationData.session.permissions.can_upload_files']").should("be.checked");

    const customCSSFile = "files/test.css";
    cy.fixture(customCSSFile).then((fileContent) => {
      cy.get('div.uploadfile.file-css input[type="file"]').then(($input) => {
        const inputElement = $input[0] as HTMLInputElement;
        const blob = new Blob([fileContent], { type: 'text/css' });
        const testFile = new File([blob], 'file-name.css', { type: 'text/css' });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        inputElement.files = dataTransfer.files;
        cy.wrap($input).trigger('change', { force: true });
      });
    });

    cy.get("#project_name").should("be.visible");

    cy.get('[data-cy="files"]').click();

    const customJSFile = "files/test.js.txt";
    cy.fixture(customJSFile).then((fileContent) => {
      cy.get('div.uploadfile.file-script input[type="file"]').then(($input) => {
        const inputElement = $input[0] as HTMLInputElement;
        const blob = new Blob([fileContent], { type: 'application/javascript' });
        const testFile = new File([blob], 'file-name.js', { type: 'application/javascript' });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        inputElement.files = dataTransfer.files;
        cy.wrap($input).trigger('change', { force: true });
      });
    });

    cy.get("#project_name").should("be.visible");
  });

  it("should upload a file and make it available for download and deletion", () => {
    cy.login_admin();
    cy.visit("#/admin/settings");
    cy.get('[data-cy="files"]').click();

    cy.get("[name='authenticationData.session.permissions.can_upload_files']").should("not.be.checked");
    cy.get("[name='authenticationData.session.permissions.can_upload_files_switch']").click();
    cy.get(".modal").should("be.visible");
    cy.get(".modal [type='password']").type(Cypress.env("user_password"));
    cy.get(".modal .btn-primary").click();

    const customFile = "files/test.txt";
    cy.fixture(customFile).then((fileContent) => {
      cy.get("div.file-custom input").then(($input) => {
        const inputElement = $input[0] as HTMLInputElement;
        const blob = new Blob([fileContent], { type: "text/plain" });
        const testFile = new File([blob], customFile, { type: "text/plain" });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        inputElement.files = dataTransfer.files;
        cy.wrap($input).trigger("change", { force: true });
      });
    });

    cy.get("#project_name").should("be.visible");

    cy.get('[data-cy="files"]').click();
    cy.get('table#fileList').find('td#file_name').should('contain', 'test.txt').should('be.visible');
    cy.get("#fileList").get("#delete").click();
  });


  it("should be able to disable the file upload", () => {
    cy.login_admin();
    cy.visit("#/admin/settings");
    cy.get('[data-cy="files"]').click();

    cy.get("[name='authenticationData.session.permissions.can_upload_files']").should("not.be.checked");
    cy.get("[name='authenticationData.session.permissions.can_upload_files_switch']").click();
    cy.get(".modal").should("be.visible");
    cy.get(".modal [type='password']").type(Cypress.env("user_password"));
    cy.get(".modal .btn-primary").click();

    cy.get("[name='authenticationData.session.permissions.can_upload_files']").should("be.checked");
    cy.get("[name='authenticationData.session.permissions.can_upload_files_switch']").click();
    cy.get('[data-cy="files"]').click();
    cy.get("[name='authenticationData.session.permissions.can_upload_files']").should("not.be.checked");

    cy.logout();
  });
});
