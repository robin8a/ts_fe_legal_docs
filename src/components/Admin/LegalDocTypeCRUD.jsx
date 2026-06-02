import React, { Component } from 'react'
// import { withAuthenticator } from 'aws-amplify-react'
// Bootstrap
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap'
// Auth css custom
// import Bootstrap from "../../common/themes"
// GraphQL
import { listLegalDocTypes, createLegalDocType, updateLegalDocType } from '../../graphql_custom'
// import { onCreateLegalDocType, onUpdateLegalDocType } from '../../graphql_custom/subscriptions'

class LegalDocTypeCRUD extends Component {

    constructor(props) {
        super(props)
        this.state = {
            legalDocTypes: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newLegalDocType: {   id: '',
                            name: '',
                            shortName: '',
                            description: ''},
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDLegalDocType = this.handleCRUDLegalDocType.bind(this)
        this.handleLoadEditLegalDocType = this.handleLoadEditLegalDocType.bind(this)
    }

    componentDidMount = async () => {
        
      await this.loadLegalDocTypes()

      // // Subscriptions
      // // OnCreate LegalDocType
      // let tempLegalDocTypes = this.state.legalDocTypes
      // this.createLegalDocTypeListener = graphqlMutation(onCreateLegalDocType)
      // .subscribe({
      //     next: createdLegalDocTypeData => {
      //         let tempOnCreateLegalDocType = createdLegalDocTypeData.value.data.onCreateLegalDocType

      //         // const filterByLegalDocTypeID = {
      //         //     filter: { 
      //         //         legalDocTypeID: {
      //         //             eq: tempOnCreateLegalDocType.id
      //         //         },
      //         //         and: {isActive: {eq: true}}
      //         //     },
      //         //     limit: 200
      //         // }
      //         // ToDo error setState is not a function
      //         // const result = API.graphql(graphqlOperation(listPrices, filterByLegalDocTypeID))

      //         // tempOnCreateLegalDocType.prices.items = result.data.listPrices.items
      //         tempLegalDocTypes.push(tempOnCreateLegalDocType)
      //         // Ordering legalDocTypes by name
      //         tempLegalDocTypes.sort((a, b) => (a.name > b.name) ? 1 : -1)
      //         // this.updateStateLegalDocTypes(tempLegalDocTypes)
      //         this.setState((state) => ({legalDocTypes: tempLegalDocTypes}))
      //     }
      // })

      // // OnUpdate LegalDocType
      // this.updateLegalDocTypeListener = graphqlMutation(onUpdateLegalDocType)
      // .subscribe({
      //     next: updatedLegalDocTypeData => {
      //         let tempLegalDocTypes = this.state.legalDocTypes.map((mapLegalDocType) => {
      //             if (updatedLegalDocTypeData.value.data.onUpdateLegalDocType.id === mapLegalDocType.id) {
      //                 return updatedLegalDocTypeData.value.data.onUpdateLegalDocType
      //             } else {
      //                 return mapLegalDocType
      //             }
      //         })
      //         // Ordering legalDocTypes by name
      //         tempLegalDocTypes.sort((a, b) => (a.name > b.name) ? 1 : -1)
      //         this.setState((state) => ({legalDocTypes: tempLegalDocTypes}))
      //     }
      // })
            

    }

    async componentWillUnmount() {
        // this.createLegalDocTypeListener.unsubscribe() 
        // this.updateLegalDocTypeListener.unsubscribe() 
    }

    async loadLegalDocTypes() {
      
        const listLegalDocTypesResult = await graphqlQuery(listLegalDocTypes)
        listLegalDocTypesResult.data.listLegalDocTypes.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({legalDocTypes: listLegalDocTypesResult.data.listLegalDocTypes.items})
    }

    handleOnChangeInputForm = async(event) => {
        let tempNewLegalDocType = this.state.newLegalDocType

        if (event.target.name === 'legalDocType.name') {
            tempNewLegalDocType.name = event.target.value.toUpperCase()
            tempNewLegalDocType.name = tempNewLegalDocType.name.replace(' ','')
        }
        if (event.target.name === 'legalDocType.unit') {
            tempNewLegalDocType.unit = event.target.value.toLowerCase()
            tempNewLegalDocType.unit = tempNewLegalDocType.unit.replace(' ','')
        }
        this.setState({newLegalDocType: tempNewLegalDocType})
        this.validateCRUDLegalDocType()
    }

    async validateCRUDLegalDocType() {
        if (this.state.newLegalDocType.name !== '' && this.state.newLegalDocType.unit !== '' ) {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDLegalDocType() {
        let tempNewLegalDocType = this.state.newLegalDocType

        if (this.state.CRUDButtonName === 'CREATE') {
            
            const newLegalDocTypetId = this.state.newLegalDocType.name + '_' + this.state.newLegalDocType.unit
            tempNewLegalDocType.id = newLegalDocTypetId

            await graphqlMutation(createLegalDocType, { input: tempNewLegalDocType })
            await this.cleanLegalDocTypeOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewLegalDocType.products
            delete tempNewLegalDocType.createdAt
            delete tempNewLegalDocType.updatedAt
            await graphqlMutation(updateLegalDocType, { input: this.state.newLegalDocType })
            await this.cleanLegalDocTypeOnCreate()
        }
    }
    

    handleLoadEditLegalDocType= async(legalDocType, event) => {

        this.setState({
            newLegalDocType:  legalDocType,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDLegalDocType()
    }

    async cleanLegalDocTypeOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newLegalDocType: {   id: '',
                            name: '',
                            unit: ''}
        })
    }
    
    // RENDER
    render() {
        // State Varibles
        let {legalDocTypes, newLegalDocType, CRUDButtonName} = this.state

        const renderLegalDocTypes = () => {
            if (legalDocTypes.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Short Name</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {legalDocTypes.map(legalDocType => (
                            <tr key={legalDocType.id}>
                                <td>
                                    {legalDocType.name}
                                </td>
                                <td>
                                    {legalDocType.shortName}
                                </td>
                                <td>
                                    {legalDocType.description}
                                </td>
                                <td>
                                    <Button 
                                        variant='primary'
                                        size='lg' 
                                        block
                                        onClick={(e) => this.handleLoadEditLegalDocType(legalDocType, e)}
                                    >Editar</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            }
        
        }


        return (
            
                <Container>
                    {renderLegalDocTypes()}
                    <br></br>
                    <Form>

                    
                        <Row className='mb-2'>

                            <Form.Group as={Col} controlId='formGridNewLegalDocTypeName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ex. GRAMS'
                                    name='legalDocType.name'
                                    value={newLegalDocType.name}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId='formGridNewLegalDocTypeUnit'>
                                <Form.Label>Unit</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ex. g'
                                    name='legalDocType.unit'
                                    value={newLegalDocType.unit}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>


                        </Row>
                        

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            block
                            onClick={this.handleCRUDLegalDocType}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                        
                    </Form>

                </Container>
            
        )
    }
}

export default LegalDocTypeCRUD