# Bertly

This is **Bertly**, the DoSomething.org link shortener. We use it to create shareable URLs, like this: [`dosome.click/wq544`](https://dosome.click/wq544).

Creating or revoking short-links requires an API key, which is provided as `X-BERTLY-API-Key`. If you need to integrate Bertly into a new application, ask in [#dev-bertly](https://dosomething.slack.com/messages/CAX6AJSF2/team/U025FRTM2/) or check the environment variables for the app in Lambda.
<br>


Endpoint              | Functionality
--------------------- | ------------------------------------------------------------------
`POST /`              | [Create Short-Link](#create-short-link)
`GET /<key>`          | [Visit Short-Link](#visit-short-link) 
`GET /<key>/clicks`   | [View Statistics](#view-statistics)
`POST /revoke/<key>`  | [Revoke Short-Link](#revoke-short-link)


## Create Short-Link

```
POST /
```

```sh
# Content-Type: application/x-www-form-urlencoded
url=https://www.github.com/dosomething/bertly
```

Given a URL, return a JSON object containing the shortened URL, and a token to use when revoking the shortened URL. If the same URL is provided multiple times, the same short-link will be returned.

<details>
<summary><strong>Example Request</strong></summary>

```sh
curl -X "POST" "https://dosome.click/" \
     -H 'X-BERTLY-API-KEY: ******' \
     -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
     --data-urlencode "url=https://www.github.com/dosomething/bertly"
```

</details>

<details>
<summary><strong>Example Response</strong></summary>

```json
{
  "revoke": "https://dosome.click/revoke/wq544",
  "status": "okay",
  "url": "https://dosome.click/wq544"
}
```

</details>


## Visit Short-Link

```
GET /<key>
```

Once a short-link is created, it can be visited by anyone & will `302 Found` redirect to the destination URL. Each time a short-link is visited, we'll record a "click" for that link. If the short-link doesn't exist, it will return a 404 page.


## View Statistics

```
GET /<key>/clicks
```

Click statistics for any short-link can be loaded with this public endpoint.

<details>
<summary><strong>Example Request</strong></summary>

```sh
curl "https://dosome.click/wq544/clicks"
```

</details>

<details>
<summary><strong>Example Response</strong></summary>

```json
{
  "count": 42,
  "status": "okay",
  "url": "https://www.github.com/dosomething/bertly"
}
```

</details>

## Revoke Short-Link

```
POST /revoke/<key>
```

If you no longer want a short-link, you can permanently delete it. This cannot be undone.

<details>
<summary><strong>Example Request</strong></summary>

```sh
curl -X "POST" "https://dosome.click/revoke/vv6s7" \
     -H 'X-BERTLY-API-KEY: ******'
```

</details>

<details>
<summary><strong>Example Response</strong></summary>

```json
{
  "status": "okay",
  "success": "hey nice job"
}
```

</details>

