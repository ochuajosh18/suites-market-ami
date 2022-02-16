import React from 'react';
import { 
    Box,
    Button,
    Grid,
    OutlinedInput,
    CardMedia
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

import { makeStyles, } from '@material-ui/core/styles';
import clsx from 'clsx';

import { toastError } from '../../../modules/Toast';
import Loader from '../../Common/Loader';
import { CategoryState } from '../../../store/category/types';

interface EditModalProps {
    classes: any;
    category: CategoryState;
    onClose: () => void;
    onClickAddEditModal: (evt: any) => void;
    onCloseEditModal: () => void;
    onChangeEditModalTextBox: (evt: any) => void;
    onClickEditModalSave: () => void;
    setUploadLayer: (layer: string) => void;
    h1UploadLoading: boolean;
    h2UploadLoading: boolean;
    uploadH1Thumbnail: (object: any) => void;
    uploadH2Thumbnail: (object: any) => void;
    uploadLayer: string;
    h1Thumbnail: string;
    h2Thumbnail: string;
}

const useStyles = makeStyles({
    imageContainerDashed: {
        borderWidth: 1,
        borderStyle: 'dashed',
        height: 120,
        width: 120,
        marginTop: 10,
        marginBottom: 20
    },
    imageContainerNoDashed: {
        borderWidth: 1,
        height: 120,
        width: 120,
        marginTop: 10,
        marginBottom: 20
    },
});

const EditModal = (props: EditModalProps) => {
    const { classes, category, onClose, onClickAddEditModal, onCloseEditModal, onChangeEditModalTextBox, onClickEditModalSave, setUploadLayer, h1UploadLoading, h2UploadLoading, uploadH1Thumbnail, uploadH2Thumbnail, uploadLayer, h1Thumbnail, h2Thumbnail } = props;
    const [data, setData] = React.useState('');
    const classes2 = useStyles();
    const inputBottomPadding = 1.5;

    if (category.modalOrigin) {
        if (
            category.modalOrigin === 'l1' ||
            category.modalOrigin === 'l2' ||
            category.modalOrigin === 'l3'
        ) {
            
           

            // if (category.editModalTextbox !== data) {
            //     setData(category.editModalTextbox)
            // }
        }
    }

    React.useEffect(() => {
        setData(category[`selected${category.modalOrigin.toUpperCase()}Category`]);
    }, [])



    const { getInputProps, open: openDropzone} = useDropzone(
        {
            onDrop: (acceptedFiles) => {
                if(acceptedFiles.length > 1) {
                    toastError('Maximum of 1 image per category only.')
                } else {
                    acceptedFiles.forEach((file) => {
                        const reader = new FileReader()
                
                        reader.onabort = () => console.log('file reading was aborted')
                        reader.onerror = () => console.log('file reading has failed')
                        reader.onload = () => {
                            // Do whatever you want with the file contents
                            // const binaryStr = reader.result   
                        }
                        reader.readAsArrayBuffer(file)
                        if(uploadLayer === 'layer1') {
                            uploadH1Thumbnail(file)
                        } else if (uploadLayer === 'layer2') {
                            uploadH2Thumbnail(file)
                        }
                    })
                }
            },
            accept: 'image/jpeg, image/png' 
        }
    )
    let image = category.modalOrigin === 'l1' ? h1Thumbnail : h2Thumbnail

    const imageContainer = clsx({
        [classes2.imageContainerDashed]: image.length > 0 ? false : true,
        [classes2.imageContainerNoDashed]: image.length > 0 ? true : false

    })

    return (
        <Box
            className={classes.modalBase}
            onClick={onClose}
        >
            <Box
                className={classes.modalRoot}
                onClick={onClickAddEditModal}
            >
                <Box display="flex" p={1.5} className={classes.appbar}>
                    <Box flexGrow={1} textAlign="center" fontWeight="bold">
                        Add new category
                    </Box>
                    <Box>
                        <Button
                            size="small"
                            color="secondary"
                            onClick={onCloseEditModal}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
                <Box className={classes.modalBody}>
                    <Box pb={inputBottomPadding}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Grid item xs={3}>
                                <Box>Category Name:</Box>
                            </Grid>
                            <Grid item xs={category.modalOrigin !== 'l3' ? 8 : 9}>
                                <OutlinedInput
                                    className="round-border1"
                                    placeholder="Category Name"
                                    fullWidth
                                    margin="dense"
                                    value={data}
                                    onChange={(e) => {
                                        onChangeEditModalTextBox(e);
                                        setData(e.currentTarget.value)
                                    }}
                                />
                            </Grid>
                            {
                                category.modalOrigin !== 'l3' &&
                                <Grid item xs={1}>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={(evt) => {
                                            openDropzone()
                                            console.log(category.modalOrigin)
                                            category.modalOrigin === 'l1' ? setUploadLayer('layer1') : setUploadLayer('layer2')
                                            
                                        }}
                                    >
                                        <CameraAltIcon />
                                    </Button>
                                </Grid>
                            }
                            
                        </Grid>
                    </Box>
                    <Box pb={inputBottomPadding}>
                        <input {...getInputProps()} />
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Grid item xs={3}>
                                {/* <Box>Category Name:</Box> */}
                            </Grid>
                            <Grid item xs={9}>
                                <Box className={imageContainer}>
                                    {
                                        h1UploadLoading || h2UploadLoading ? <Loader />
                                        :
                                        <CardMedia 
                                            component="img"
                                            style={{height: '100%', width: '100%', objectFit: 'contain'}} 
                                            src={image.length > 0 ? image : require('../../../assets/images/ImagePlaceHolder.png')}
                                        />
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        pt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={`round-border1`}
                            onClick={onClickEditModalSave}
                        >
                            {
                                category.updateLoading ? <Loader /> : "Update"
                            }
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default EditModal;