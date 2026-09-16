import INoveltyType from "../../components_interfaces/CardA_&_CardSA/INoveltyType"

type modalProps = {
    modalVisible?: boolean
    selectedItem?: INoveltyType
    addModalVisible?: boolean
    confirmUpdateModalVisible?: boolean
    itemToUpdateIndex?: number
    formValues?: INoveltyType
}


export default modalProps;