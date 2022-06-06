import { useState, useRef, forwardRef } from "react"
import { Button, Card, Container, Form, Grid, Header, Item, Label, List, Menu, Modal, Placeholder, Ref, Segment, TextArea } from "semantic-ui-react"
import { gql } from "@apollo/client"
import SyntaxHighlighter from "react-syntax-highlighter"
import * as libinfo from "../public/jquery_deprecations.json"

export default function Home({ gqlClient }) {
  const searchQueryRef = useRef(null)
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false);
  return (
    <Container fluid
      style={{
        marginTop: "40px"
      }}
      children={
        <>
          <Container
            textAlign="center"
            children={
              <Header>
                CS 230 Project — Application of Structural Code Search
              </Header>
            }
          />
          <Grid
            style={{ marginTop: "15px", marginRight: "10px" }}
            children={
              <>
                <Grid.Column width={5}>
                  <C1 onClick={
                    q => {
                      searchQueryRef.current.value = `context:global lang:JavaScript content:${q} -file:jquery -file:vendor -file:bundle -file:.min`
                      setSearchResults(null);
                    }
                  } />
                </Grid.Column>
                <Grid.Column width={11}>
                  <C2 ref={searchQueryRef}
                    onClickSearch={_ => {
                      setLoading(true)
                      gqlClient.query({
                        query: gql`
                            query ($query: String!) {
                              search(query: $query, patternType: structural, version: V2) {
                                results {
                                  results {
                                    __typename
                                    ... on FileMatch {
                                      ...FileMatchFields
                                    }
                                  }
                                  limitHit
                                  matchCount
                                  elapsedMilliseconds
                                }
                              }
                            }
            
                            fragment FileMatchFields on FileMatch {
                              repository {
                                name
                                url
                              }
                              file {
                                name
                                path
                                url
                                content
                                commit {
                                  oid
                                }
                              }
                              lineMatches {
                                preview
                                lineNumber
                                offsetAndLengths
                                limitHit
                              }
                            }
                          `,
                        variables: {
                          query: searchQueryRef.current.value
                        }
                      }).then(res => {
                        setSearchResults(res.data.search.results)
                        setLoading(false)
                      });
                    }}
                  />
                  <Container fluid style={{ marginTop: "4em" }}
                    children={
                      <>
                        <Header color="blue" dividing content="Search Results 👇" />
                        {loading
                          ? <Placeholder fluid content="... loading ..." />
                          : <C3 searchResults={searchResults}
                            onClickExclude={frag => searchQueryRef.current.value += ` ${frag}`}
                          />
                        }
                      </>
                    }
                  />
                </Grid.Column>
              </>
            }
          />
        </>
      }
    />
  )
}

export function C1({ onClick }) {
  return (
    <Menu fluid vertical>
      <>
        <Header
          textAlign="center" size="small" style={{ marginTop: "0.7em" }}
          children={
            <>
              <Header.Content content="jQuery deprecations" />
              <Header.Subheader style={{ marginTop: "0.3em" }}
                as="a" target="_blank"
                href="https://api.jquery.com/category/deprecated/"
                content="https://api.jquery.com/category/deprecated/"
              />
            </>
          }
        />
        {libinfo.deprecations.map(
          (api, i) => (
            <Menu.Item
              key={i} index={i}
              name={api.name} link
              onClick={_ => onClick(api.query)}
              children={
                <>
                  <Label color="red" content={api.removed_in || NaN} size="mini" />
                  <Label color="orange" content={api.deprecated_in} size="mini" />
                  <Label color="green" content={api.added_in} size="mini" />
                  <p
                    style={{ fontFamily: "monospace", fontSize: "0.8em" }}
                    children={api.name}
                  />
                </>
              }
            />
          )
        )}
      </>
    </Menu>
  )
}

export const C2 = forwardRef(
  ({ onClickSearch }, ref) => (
    <Form>
      <Label corner="left" icon="book" as="a"
        onClick={
          _ => window.open(
            "https://docs.sourcegraph.com/code_search/reference", "_blank",
            "popup, menubar, resizable, width=600, height=600, left=400, top=200"
          )
        }
      />
      <Ref innerRef={ref}>
        <TextArea style={{ fontFamily: "monospace", paddingLeft: "3em" }} />
      </Ref>
      <Button color="pink" style={{ marginTop: "1em" }}
        icon="search" content="search"
        onClick={onClickSearch}
      />
    </Form>
  )
)

export function C3({ searchResults, onClickExclude }) {
  return (
    <>
      {searchResults && <Label size="large" color="teal"
        content={`${searchResults.matchCount} matches`}

      />}
      {searchResults?.results.map(
        (result, i) => {
          let lines = result.file.content.split("\n")
          return (
            <Segment raised key={i} style={{ marginTop: "3em" }}
              children={
                <>
                  <Label as="a"
                    icon="github" content={result.repository.name}
                    onClick={
                      _ => window.open(
                        `https://${result.repository.url}`, "_blank",
                        "popup, menubar, resizable, width=600, height=600, left=400, top=200"
                      )
                    }
                  />
                  <Label as="a"
                    icon="file" content={result.file.path}
                    onClick={
                      _ => window.open(
                        `https://${result.file.url.replace("-/blob/", `blob/${result.file.commit.oid}/`)}`, "_blank",
                        "popup, menubar, resizable, width=600, height=600, left=400, top=200"
                      )
                    }
                  />

                  <ModalExampleModal result={result}>
                    <Button color="yellow" floated="right" icon="bell" size="tiny" />
                  </ModalExampleModal>
                  <Button color="vk" floated="right" size="tiny" style={{ marginRight: "1em" }}
                    content="exclude filename" onClick={_ => onClickExclude(`-file:${result.file.name}`)}
                  />
                  <Button color="vk" floated="right" size="tiny" style={{ marginRight: "1em" }}
                    content="exclude repo" onClick={_ => onClickExclude(`-repo:${result.repository.name}`)}
                  />

                  {
                    result.lineMatches.map(
                      (match, j) => (
                        <Card fluid color={["green", "yellow", "orange", "red"][j % 4]}>
                          <Label as="a" color="blue" icon="pin"
                            content={`L${match.lineNumber - 3} — L${match.lineNumber + 3}`}
                            onClick={
                              _ => window.open(
                                `https://${result.file.url.replace("-/blob/", `blob/${result.file.commit.oid}/`)}#L${match.lineNumber - 3}-L${match.lineNumber + 3}`,
                                "_blank", "popup, menubar, resizable, width=600, height=600, left=400, top=200"
                              )
                            }
                          />
                          <Card.Content>
                            <SyntaxHighlighter language="javascript"
                              showLineNumbers startingLineNumber={match.lineNumber - 3}
                              children={lines.slice(match.lineNumber - 3, match.lineNumber + 3).join("\n")}
                            />
                          </Card.Content>
                        </Card>
                      )
                    )
                  }
                </>
              }
            />
          )
        }
      )}
    </>
  )
}

function ModalExampleModal(props) {
  const [open, setOpen] = useState(false)
  let lines = props.result.file.content.split("\n")
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={props.children}
    >
      <Modal.Header>Post GitHub Issue</Modal.Header>
      <Modal.Content>
        <Segment>
          <Header size="tiny" icon="file" style={{ marginBottom: "1.5em" }}
            content={props.result.file.path}
          />
          <p>
            {`⚠️ Following code snippets possibly contain deprecated jquery APIs ⚠️`}
          </p>
          {
            <List>
              {props.result.lineMatches.map(
                (match, j) => (
                  <Item>
                    <SyntaxHighlighter language="javascript"
                      showLineNumbers startingLineNumber={match.lineNumber - 3}
                      children={lines.slice(match.lineNumber - 3, match.lineNumber + 3).join("\n")}
                    />
                  </Item>
                )
              )}
            </List>
          }
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Submit"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}