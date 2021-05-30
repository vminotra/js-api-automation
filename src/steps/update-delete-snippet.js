import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'assert/strict'
import { Request } from '../helpers/api_call'
import { baseUrl, snippet } from '../helpers/api_endpoints'

import { create_snippet_body, headers, list_snippets_params, token_pair } from '../test-data/testdata.json'

const apiCall = new Request();
let returnedSnippet;
let updateAPIResponse;
let deleteResponse;

let authHeaders = headers;
authHeaders["Authorization"] = token_pair.auth_token;
let updatedRequestBody = create_snippet_body;

When("I create a new snippet", async () => {
    
    let endPointUrl = `${baseUrl}${snippet}`;
    const response = await apiCall.postRequest(endPointUrl, authHeaders, create_snippet_body);
    returnedSnippet = response.body;
    assert.equal(response.statusCode, 200, 'Create API request returned a status code other than 200');

});

Given("I update the newly created snippet", async () => {

    updatedRequestBody.title = "test updated";
    updatedRequestBody.files[0].content = "print('vikrant') \nprint('new line added')";

    const response = await apiCall.putRequest(returnedSnippet.url, authHeaders, updatedRequestBody);
    updateAPIResponse = response.body;
    assert.equal(response.statusCode, 200, 'Update API request returned a status code other than 200');

});

Then("the snippet should contain the updated contents", async () => {

    assert.notDeepEqual(create_snippet_body.files, updateAPIResponse.files, 'No change in file contents before and after update');
    assert.equal(updatedRequestBody.title, updateAPIResponse.title, 'Title of snippet does not match value passed to update API');
    assert.deepEqual(updatedRequestBody.files, updateAPIResponse.files, 'Returned file contents do not match values passed to update API');

});

Given("I delete the created snippet", async () => {

    const response = await apiCall.deleteRequest(returnedSnippet.url, authHeaders);
    deleteResponse = response;
    // assert.deepEqual(deleteResponse, {}, 'Delete request returned a non-empty body')

});

Then("I should receieve a 204 no content response", async() => {

    assert.equal(deleteResponse.statusCode, 204, 'Delete request returned a status code other than 204');

});