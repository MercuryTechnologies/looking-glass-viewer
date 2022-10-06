# Looking Glass

> **Warning**
> This tool was a prototype for an internal tool, and is thus not actively
> maintained. It will probably not receive any updates in the future.

This is a tool for visualizing relationships between objects as [network
graphs], structures of "nodes" (points) and "edges" (connections between
nodes). Graph viewers have many applications, such as for tracing relationships
between entities, for dependency graphs, and more.

## Why not GraphViz?

I love GraphViz and use it often, but it can often choke on very large graphs.
This tool is built with [Sigma.js](https://www.sigmajs.org/), which is a graph
library explicitly designed for large graphs. The tool has been practically
used on graphs in the high hundreds of nodes.

## Input format

It takes data in [JSON format], which Postgres supports natively and can
generate directly as a result of a query. See the [Postgres JSON documentation]
for details on all the things you can do with this data. I've included an
example below of generating JSON for Looking Glass directly in PostgreSQL.

There is a [full specification][model] of the format with lots of comments in
the source code. This is written in TypeScript, but no worries if you've never
read it before! Start at the `interface GraphDef`. This describes the entire
object that the viewer expects to see.

Properties look like `name: type`, and if there's a `?` after the name like
`name?: type`, the property is optional.

[network graphs]: https://en.wikipedia.org/wiki/Graph_theory
[JSON format]: https://en.wikipedia.org/wiki/JSON
[Postgres JSON documentation]: https://www.postgresql.org/docs/current/functions-json.html

This is a super basic example of some JSON this tool accepts:

```json
{
  "edges": [
    {
      "to": "someOtherNode",
      "from": "someNode",
      "amount": "2.50"
    },
    {
      "to": "yetAnotherNode",
      "from": "someOtherNode",
      "amount": "125.00"
    }
  ],
  "nodes": {
    "someNode": {
      "color": "red",
      "props": {
        "someProp": "someNode",
        "googleSearch": "sherlock holmes"
      }
    },
    "someOtherNode": {
      "color": "red",
      "props": {
        "someProp": "someOtherNode",
        "googleSearch": "sherlock holmes"
      }
    }
  },
  "title": "My visualization"
}
```

Here is the SQL program that generated it:

```sql
-- put an actual query here
with edges (target, source, amount) as (values
    ('someNode', 'someOtherNode', 2.50::numeric),
    ('someOtherNode', 'yetAnotherNode', 125.00)
),
nodesJson as (
    -- we've decided that all the nodes appearing on the left side should be
    -- red
    select jsonb_object_agg(distinct edges.target, jsonb_build_object(
            'color', 'red',
            'props', jsonb_build_object(
                'someProp', edges.target,
                'googleSearch', 'Sherlock Holmes'
            )
        )) j
    from edges
),
edgesJson as (
    select jsonb_agg(jsonb_build_object(
        'from', edges.target,
        'to', edges.source,
        'amount', cast(edges.amount as text)
    )) j
    from edges
)

select jsonb_build_object(
    'title', 'My visualization',
    'edges', edgesJson.j,
    'nodes', nodesJson.j
) from edgesJson, nodesJson
```
