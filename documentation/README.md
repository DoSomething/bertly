# Bertly

This is **Bertly**, the DoSomething.org link shortener. We use it to create shareable URLs, like this: [`dosome.click/wq544`](https://dosome.click/wq544).

Creating or revoking short-links requires an [access token](https://github.com/DoSomething/northstar/blob/master/documentation/authentication.md) or the `X-BERTLY-API-Key` API key.

<br>

| Endpoint           | Functionality                 |
| ------------------ | ----------------------------- |
| `POST /`           | [Create Link](#create-link)   |
| `GET /{link}`      | [Visit Link](#visit-link)     |
| `GET /{link}/info` | [Inspect Link](#inspect-link) |
| `DELETE /{link}`   | [Destroy Link](#destroy-link) |

## Create Link

```
POST /
```

Given a URL, return a JSON object containing the shortened URL, and a token to use when revoking the shortened URL. If the same URL is provided multiple times, the same short-link will be returned. If this link is created by a non-staff user, it's restricted to a [list of safe domains](https://github.com/DoSomething/bertly/blob/master/config/domains.js).

The request body is accepted as either `application/json` or `application/x-www-form-urlencoded`.

<details>
<summary><strong>Example Request</strong></summary>

```sh
curl -X "POST" "https://dosome.click/" \
     -H 'Authorization: Bearer ******' \
     --data-urlencode "url=https://www.github.com/dosomething/bertly"
```

</details>

<details>
<summary><strong>Example Response</strong></summary>

```json
{
  "key": "wq544",
  "url": "https://dosome.click/wq544",
  "url_long": "https://www.github.com/dosomething/bertly",
  "url_short": "https://dosome.click/wq544",
  "updated_at": "2020-08-03T19:36:43.695Z",
  "created_at": "2020-06-09T18:13:08.663Z"
}
```

</details>

## Visit Link

```
GET /{link}
```

Once a short-link is created, it can be visited by anyone & will `302 Found` redirect to the destination URL. Each time a short-link is visited, we'll record a "click" for that link. If the short-link doesn't exist, it will return a 404 page.

## Inspect Link

```
GET /{link}/info
```

Click statistics for any short-link can be loaded with this public endpoint.

<details>
<summary><strong>Example Request</strong></summary>

```sh
curl "https://dosome.click/wq544/info"
```

</details>

<details>
<summary><strong>Example Response</strong></summary>

```json
{
  "key": "wq544",
  "url": "https://dosome.click/wq544",
  "url_long": "https://www.github.com/dosomething/bertly",
  "url_short": "https://dosome.click/wq544",
  "updated_at": "2020-08-03T19:36:43.695Z",
  "created_at": "2020-06-09T18:13:08.663Z"
}
```

</details>

## Destroy Link

```
DELETE /{link}
```

If you no longer want a short-link, you can permanently delete it. This cannot be undone.

<details>
<summary><strong>Example Request</strong></summary>

```sh
curl -X "DELETE" "https://dosome.click/vv6s7" \
     -H 'Authorization: Bearer ******' \
```

</details>

<details>
<summary><strong>Example Response</strong></summary>

```json
{ "message": "Link deleted." }
```

</details>
