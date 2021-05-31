import { Given, When, Then } from '@cucumber/cucumber'
import assert from 'assert/strict'
import { Request } from '../helpers/api_call'
import { baseUrl, snippet } from '../helpers/api_endpoints'
import { create_snippet_body, headers, list_snippets_params, token_pair } from '../test-data/testdata.json'

const apiCall = new Request();
let returnedSnippet;
let snippetURLResponse;
let userSnippetsResponse;

When("I call the create snippet endpoint", async () => {

    const endPointUrl = `${baseUrl}${snippet}`;
    const response = await apiCall.postRequest(endPointUrl, headers, create_snippet_body);
    returnedSnippet = response.body.url;

    assert.equal(response.statusCode, 200, 'Create API request returned a status code other than 200')

});

Given("I call the returned snippet url", async () => {

    snippetURLResponse = await apiCall.getRequest(returnedSnippet, headers);
    assert.equal(snippetURLResponse.statusCode, 200, 'Snippet API request returned a status code other than 200')
});

Then("returned snippet url contents should match the contents passed to create snippet api", {timeout: 2 * 5000}, async() => {

   assert.equal(create_snippet_body.language, snippetURLResponse.body.language, 'Language of created snippet does not match inputs passed to create snippet endpoint');
   assert.equal(create_snippet_body.title, snippetURLResponse.body.title, 'Language of created snippet does not match inputs passed to create snippet endpoint');
   assert.deepEqual(create_snippet_body.files, snippetURLResponse.body.files, 'Contents of created snippet does not match inputs passed to create snippet endpoint'); 

});

When("I create a new snippet using an existing auth token", async () => {

    const endPointUrl = `${baseUrl}${snippet}`;
    let authHeaders = headers;
    authHeaders["Authorization"] = token_pair.auth_token;
    const response = await apiCall.postRequest(endPointUrl, authHeaders, create_snippet_body);
    returnedSnippet = response.body;
    assert.equal(response.statusCode, 200, 'Create API request returned a status code other than 200') 

});

Given("I list the snippets of the user corresponding to the auth token", async () => {

    const userSnippetsUrl = `${baseUrl}${snippet}?owner=${token_pair.username}`;
    userSnippetsResponse = await apiCall.getRequest(userSnippetsUrl, headers);
    assert.equal(userSnippetsResponse.statusCode, 200, 'List snippets API request returned a status code other than 200')

});

Then("the first item should be the newly created snippet", async() => {

    let userLatestSnippet = userSnippetsResponse.body[0];
    assert.equal(returnedSnippet.created, userLatestSnippet.created, 'Created snippet and user latest snippet creation time does not match');
    assert.equal(returnedSnippet.url, userLatestSnippet.url, 'Created snippet and user latest snippet url does not match');
    assert.equal(returnedSnippet.owner, userLatestSnippet.owner, 'Created snippet and user latest snippet owner does not match');
    assert.equal(returnedSnippet.title, userLatestSnippet.title, 'Created snippet and user latest snippet title does not match');

});
