package com.ssafy.alttab.common.exception;

public class MemberNotFoundException extends Exception{

    public MemberNotFoundException(String name) {
        super(name + " 를 찾을 수 없습니다.");
    }
}