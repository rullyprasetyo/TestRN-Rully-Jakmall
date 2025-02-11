import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { keyExtractor } from '../../Utils'
import { getCategories, getJokes } from '../../Apis/Redux/actions/homeActions'
import { styles, Header, Icon, ModalJokes } from '../../Components'
import { setCategory } from '../../Apis/Redux/reducers'

const HomeScreen = (props) => {
    //state
    const dispatch = useDispatch()
    const { dataCategory, dataJokes } = useSelector((state) => state.home)
    const [activeCategory, setActiveCategory] = useState(0)
    const [selectedJokes, setSelectedJokes] = useState('')
    const [updateCategory, setUpdateCategory] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [activeModal, setActiveModal] = useState(false)
    const jokesParams = { type: "single", amount: 2 }

    //effect
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getJokes(jokesParams));
    }, [])

    //handler
    const handlerPin = (data) => {
        let arr = [...dataCategory]
        arr.map((categories, i) => {
            if (categories === data) {
                arr.splice(i, 1);
                arr.unshift(categories)
            }
        });
        dispatch(setCategory(arr))
        setActiveCategory(0)
        setUpdateCategory(!updateCategory)
    }

    const handlerExpand = (index) => {
        if (dataCategory.map((e, i) => i == index)) {
            setActiveCategory(index)
        }
        if (activeCategory == index) {
            setActiveCategory(null)
        }
    }

    const handlerMoreJokes = () => {
        let params = {
            type: "single",
            amount: dataJokes.length + 2
        }
        dispatch(getJokes(params))
    }

    const handlerModalJokes = (jokes) => {
        setSelectedJokes(jokes)
        setActiveModal(!activeModal)
    }

    const handlerRefresh = () => {
        dispatch(getCategories());
        dispatch(getJokes(jokesParams));
        setActiveCategory(0)
    }

    //render
    const renderHeader = () => {
        return (
            <Header
                screenName={props.route.name}
            />
        )
    }

    const renderCategory = (item) => {
        const topValidation = item.index == 0 && item.item == item.item
        return (
            <View elevation={3} style={styles.cardCategory}>
                <View style={styles.category}>
                    <View style={styles.category1}>
                        <Text style={styles.textRegularBlack}>{item.index + 1}. </Text>
                        <Text style={styles.textRegularSemiRed}>{item.item}</Text>
                    </View>
                    <TouchableOpacity disabled={topValidation} style={topValidation ? styles.buttonCategoryTop : styles.buttonCategory} onPress={() => handlerPin(item.item)}>
                        <Text style={topValidation ? styles.textButtonWhite : styles.textButtonRed}>{topValidation ? 'Pinned' : 'Pin'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlerExpand(item.index)}>
                        <Icon
                            type='ionicon'
                            name={item.index == activeCategory ? 'chevron-up-outline' : 'chevron-down-outline'}
                            size={25}
                            color='#FF1A4D'
                        />
                    </TouchableOpacity>
                </View>
                {
                    item.index == activeCategory ?
                        <View>
                            <View style={styles.divider} />
                            <FlatList
                                data={dataJokes}
                                keyExtractor={keyExtractor}
                                renderItem={(item) => renderJokes(item)}
                            />
                        </View>
                        : null
                }
            </View>
        )
    }

    const renderJokes = (item) => {
        return (
            <View>
                <TouchableOpacity key={item.index} style={styles.cardJokes} onPress={() => handlerModalJokes(item.item.joke)}>
                    <Text style={styles.textRegularBlack}>{item.item.joke}</Text>
                </TouchableOpacity>
                {
                    item.index === dataJokes.length - 1 && dataJokes.length <= 5 ?
                        <TouchableOpacity style={styles.buttonBlue} onPress={() => handlerMoreJokes()}>
                            <Text style={styles.textButtonWhite}>Add more jokes</Text>
                        </TouchableOpacity>
                        : null
                }
            </View>
        )
    }

    const renderModalJokes = () => {
        return (
            <ModalJokes 
            visible={activeModal}
            jokes={selectedJokes}
            onClose={() => setActiveModal(!activeModal)}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={styles.contentWrap}>
            {renderModalJokes()}
                <FlatList
                    data={dataCategory}
                    extraData={updateCategory}
                    keyExtractor={keyExtractor}
                    renderItem={(item) => renderCategory(item)}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={handlerRefresh}
                        />
                    }
                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen