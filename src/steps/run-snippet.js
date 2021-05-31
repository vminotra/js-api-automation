import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'assert/strict'
import { Request } from '../helpers/api_call'
import { baseUrl, snippet, runSnippet, latestPython } from '../helpers/api_endpoints'

import { headers, token_pair, execution_snippet, expected_execution_output } from '../test-data/testdata.json'

const apiCall = new Request();
let authHeaders = headers;
authHeaders["Authorization"] = token_pair.auth_token;

let testSnippetUrl = `${baseUrl}${snippet}/${execution_snippet}`; 
let executionEndpoint = `${baseUrl}${runSnippet}${latestPython}`;
let executionSnippetFile;
let runSnippetResponse;

When("I fetch the contents of a snippet", async () => {

    const snippetReponse = await apiCall.getRequest(testSnippetUrl, authHeaders);
    executionSnippetFile = snippetReponse.body.files;
    assert.equal(snippetReponse.statusCode, 200, 'Snippet request returned a status code other than 200');

});

Given("I pass the file contents to the run snippet endpoint", async () => {

    let runPayload = {};
    runPayload["files"] = executionSnippetFile;
    runSnippetResponse = await apiCall.postRequest(executionEndpoint, authHeaders, runPayload);

});

Then("I should get the expected output of the code snippet", async() => {

    assert.deepEqual(runSnippetResponse.body, expected_execution_output, 'Execution output and expected output do not match');

});