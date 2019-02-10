import React, {Component} from 'react'

import {Button, ButtonProps} from "react-native-paper";
import {T} from "../../style/values";

export default class CommonButton extends Component<ButtonProps> {

    render(): React.ReactNode {
        return <Button {...buttonProps} {...this.props} />
    }
}

export const buttonProps = {
    mode: 'contained',
    color: T.color.accent
} as ButtonProps